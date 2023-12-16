#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

// Khai báo chân kết nối với các cảm biến và thiết bị khác
const int DHT_PIN = 14;          // Chân kết nối với cảm biến nhiệt độ và độ ẩm DHT11
const int LED_PIN = 25;          // Chân kết nối với đèn LED
const int SPEAKER_PIN = 5;       // Chân kết nối với loa cảnh báo
const int GAS_SENSOR_PIN = 34;   // Chân kết nối với cảm biến khí gas
const int FLAME_SENSOR_PIN = 33; // Chân kết nối với cảm biến lửa
DHT dht(DHT_PIN, DHT11);         // Khởi tạo đối tượng DHT
int GAS_THRESHOLD = 800;         // Ngưỡng cảnh báo khí gas
int TEMP_THRESHOLD = 50;
int HUM_THRESHOLD = 100;
unsigned long lastAlertTime = 0;
bool alertEnabled = true;        // Khởi tạo biến để bật thông báo

// Thông tin kết nối WiFi và MQTT broker
const char* ssid = "P503";
const char* password = "503503503";
const char* mqtt_server = "broker.hivemq.com";

WiFiClient espClient;
PubSubClient client(espClient);
unsigned long lastMsg = 0;

// Hàm cài đặt kết nối WiFi
void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  randomSeed(micros());
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

// Hàm xử lý callback khi nhận được tin nhắn từ MQTT broker
void callback(char* topic, byte* payload, unsigned int length) {
  String temp;
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    temp += (char)payload[i];
  }
  Serial.println(temp);

  // Xử lý tin nhắn dựa trên chủ đề (topic) nhận được từ broker
  if (String(topic) == "/PTIT_Test/p/alert") {
    // Nhận giá trị từ topic "/PTIT_Test/p/alert" để tắt cảnh báo 
    if (temp.toInt() == 0) {
      // Tắt cảnh báo
      alertEnabled = false;
      digitalWrite(SPEAKER_PIN, LOW);
      lastAlertTime = millis();
      Serial.print("The warning system has been turned off");
    } else {
      // Bật lại cảnh báo
      alertEnabled = true;
    }
  }
  else if (String(topic) == "/PTIT_Test/p/setupGas") {
    // Nhận giá trị từ topic "/PTIT_Test/p/setup" để cài đặt ngưỡng cảnh báo gas
    GAS_THRESHOLD = temp.toInt();
    Serial.print("Gas Threshold has been set to: ");
    Serial.println(GAS_THRESHOLD);
  }
  else if (String(topic) == "/PTIT_Test/p/setupTemp") {
    // Nhận giá trị từ topic "/PTIT_Test/p/setup" để cài đặt ngưỡng cảnh báo gas
    TEMP_THRESHOLD = temp.toInt();
    Serial.print("Temp Threshold has been set to: ");
    Serial.println(TEMP_THRESHOLD);
  }
  else if (String(topic) == "/PTIT_Test/p/setupHum") {
    // Nhận giá trị từ topic "/PTIT_Test/p/setup" để cài đặt ngưỡng cảnh báo gas
    HUM_THRESHOLD = temp.toInt();
    Serial.print("Hum Threshold has been set to: ");
    Serial.println(HUM_THRESHOLD);
  }
}

// Hàm kết nối lại đến MQTT broker
void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = "ESP32Client-";
    clientId += String(random(0xffff), HEX);
    if (client.connect(clientId.c_str())) {
      Serial.println("Connected to " + clientId);

      client.publish("/PTIT_Test/p/mqtt", "PTIT_Test");

      client.subscribe("/PTIT_Test/p/alert");
      client.subscribe("/PTIT_Test/p/setupGas");
      client.subscribe("/PTIT_Test/p/setupTemp");
      client.subscribe("/PTIT_Test/p/setupHum");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(2000);
    }
  }
}

// Hàm cài đặt ban đầu
void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
  dht.begin();
  delay(2000);
  pinMode(LED_PIN, OUTPUT);
  pinMode(SPEAKER_PIN, OUTPUT);
  pinMode(GAS_SENSOR_PIN, INPUT);
  pinMode(FLAME_SENSOR_PIN, INPUT);
}

// Hàm lặp chính
void loop() {
  // Kiểm tra kết nối đến MQTT broker, kết nối lại nếu cần
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
  unsigned long now = millis();
  // Gửi dữ liệu đến MQTT broker mỗi 2 giây
  if (now - lastMsg > 2000) {
    lastMsg = now;
    
    // Đọc dữ liệu từ cảm biến và gửi đến broker
    float tempValue = dht.readTemperature();
    float humValue = dht.readHumidity();
    int gasValue = analogRead(GAS_SENSOR_PIN);
    int flameValue = digitalRead(FLAME_SENSOR_PIN);

    // Gửi dữ liệu đo đến MQTT broker
    String tempStr = String(tempValue, 2);
    client.publish("/PTIT_Test/p/temp", tempStr.c_str());
    String humStr = String(humValue, 1);
    client.publish("/PTIT_Test/p/hum", humStr.c_str());
    client.publish("/PTIT_Test/p/gas", String(gasValue).c_str());
    client.publish("/PTIT_Test/p/flame", String(flameValue).c_str());

    // In dữ liệu đo ra Serial Monitor
    Serial.print("Temperature: ");
    Serial.println(tempStr);
    Serial.print("Humidity: ");
    Serial.println(humStr);
    Serial.print("Gas Value: ");
    Serial.println(gasValue);
    Serial.print("Flame Value: ");
    Serial.println(flameValue);

    // Bật đèn và loa cảnh báo nếu phát hiện lửa và khí gas, và cảnh báo đang được bật
    if (alertEnabled && (flameValue == 0 || gasValue > GAS_THRESHOLD || tempValue > TEMP_THRESHOLD || humValue > HUM_THRESHOLD)) {
      digitalWrite(LED_PIN, HIGH);
      digitalWrite(SPEAKER_PIN, HIGH);
    } else {
      digitalWrite(LED_PIN, LOW);
      digitalWrite(SPEAKER_PIN, LOW);
    }

    // Kiểm tra thời gian từ khi cảnh báo được tắt, sau 5 phút, bật lại cảnh báo
     if (!alertEnabled && (now - lastAlertTime > 300000)) {
      alertEnabled = true;
      client.publish("/PTIT_Test/p/alert", "1");
    }
  }
}
