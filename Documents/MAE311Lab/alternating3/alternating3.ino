/*
  Blink
  Turns on an LED on for one second, then off for one second, repeatedly.

  Most Arduinos have an on-board LED you can control. On the Uno and
  Leonardo, it is attached to digital pin 13. If you're unsure what
  pin the on-board LED is connected to on your Arduino model, check
  the documentation at http://www.arduino.cc

  This example code is in the public domain.

  modified 8 May 2014
  by Scott Fitzgerald
 */

int led_green = 13;
int led_red = 12;
int led_blue = 10;
// the setup function runs once when you press reset or power the board
void setup() {
  // initialize digital pin 13 as an output.
  pinMode(led_green, OUTPUT);
  pinMode(led_red, OUTPUT);
  pinMode(led_blue, OUTPUT);
}

// the loop function runs over and over again forever
void loop() {
  digitalWrite(led_red, LOW);
  digitalWrite(led_green, HIGH);   
  digitalWrite(led_blue, LOW);
  delay(500);
  digitalWrite(led_green, LOW); 
  digitalWrite(led_red, HIGH);  
  digitalWrite(led_blue, LOW);
  delay(500);    
  digitalWrite(led_green, LOW); 
  digitalWrite(led_red, LOW);  
  digitalWrite(led_blue, HIGH);
  delay(500);     
}
