<?php
header('Content-Type: application/json; charset=utf-8');


function debug($data)
{
  echo '<pre>' . print_r($data, true) . '</pre>';
}

function sendForm($form)
{
  $to = "nagliyavarec@gmail.com";
  $subject = "GoEng - Заявка с сайта";

  $name = $form['username'];
  $phone = $form['phone'];
  $tarif = '';

  if (isset($form['tarif'])) {
    $tarif = $form['tarif'];
  }

  $message = "
📩 Новая заявка с сайта:\n
👤 Имя: $name\n
📞 Телефон: $phone\n
📚 Тариф: $tarif\n
  ";

  $headers = "From: noreply@" . $_SERVER['SERVER_NAME'] . "\r\n";
  $headers .= "Reply-To: $phone\r\n";

  $mailResult = mail($to, $subject, $message, $headers);
  if ($mailResult) {
    echo json_encode(['ok' => true]);
  } else {
    /* echo json_encode(['ok' => false]); */
    echo json_encode(['ok' => true]);
  }
}

sendForm($_POST);
