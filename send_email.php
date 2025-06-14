<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    function clean_input($data) {
        return htmlspecialchars(strip_tags(trim($data)));
    }

    $full_name = clean_input($_POST["full_name"] ?? '');
    $email = clean_input($_POST["email"] ?? '');
    $phone = clean_input($_POST["phone"] ?? '');
    $company = clean_input($_POST["company"] ?? ''); // Optional
    $subject = clean_input($_POST["subject"] ?? '');
    $message = clean_input($_POST["message"] ?? '');

    $errors = [];

    // Validate Full Name
    if (empty($full_name)) {
        $errors["full_name"] = "Full name is required.";
    }

    // Validate Email
    if (empty($email)) {
        $errors["email"] = "Email is required.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors["email"] = "Invalid email format.";
    }

    // Validate Phone Number
    if (empty($phone)) {
        $errors["phone"] = "Phone number is required.";
    } elseif (!preg_match("/^[0-9\-\+\(\) ]+$/", $phone)) {
        $errors["phone"] = "Invalid phone number format.";
    }

    // Validate Subject
    if (empty($subject)) {
        $errors["subject"] = "Subject is required.";
    }

    // Validate Message
    if (empty($message)) {
        $errors["message"] = "Message is required.";
    }

    if (!empty($errors)) {
        echo json_encode(["status" => "error", "errors" => $errors]);
        exit;
    }

    // Prevent Email Header Injection
    if (preg_match("/(content-type|bcc:|cc:|to:)/i", implode(" ", $_POST))) {
        echo json_encode(["status" => "error", "message" => "Invalid input detected."]);
        exit;
    }

    // Email recipient
    $to = "your-email@example.com"; // Change to your actual email
    $headers = "From: $email\r\nReply-To: $email\r\nContent-Type: text/plain; charset=UTF-8";

    $email_body = "Full Name: $full_name\n";
    $email_body .= "Email: $email\n";
    $email_body .= "Phone: $phone\n";
    if (!empty($company)) {
        $email_body .= "Company: $company\n";
    }
    $email_body .= "Subject: $subject\n\n";
    $email_body .= "Message:\n$message\n";

    // Send email
    if (mail($to, $subject, $email_body, $headers)) {
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to send email."]);
    }
}

