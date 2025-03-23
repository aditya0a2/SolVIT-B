function sendWelcomeEmail(e) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var lastRow = sheet.getLastRow(); // Get last filled row

    var email = sheet.getRange(lastRow, 2).getValue(); // Email from Column B
    var name = sheet.getRange(lastRow, 3).getValue(); // Name from Column C
    var contactNumber = sheet.getRange(lastRow, 5).getValue(); // Contact Number from Column E
    var location = sheet.getRange(lastRow, 6).getValue(); // Location from Column F
    var serviceProvided = sheet.getRange(lastRow, 7).getValue(); // Service from Column G
    var timeSlot = sheet.getRange(lastRow, 8).getValue(); // Time Slot from Column H

    if (!email) return; // Stop if no email is found

    var subject = "Welcome to ServeEase.pro – Your Registration is Successful!";
    var message = "Dear " + name + ",\n\n" +
        "Congratulations! 🎉 You have successfully registered as a service provider on ServeEase.pro.\n\n" +
        "🔹 **Your Registration Details:**\n" +
        "✅ Registered Service: " + serviceProvided + "\n" +
        "✅ Contact Number: " + contactNumber + "\n" +
        "✅ Service Area: " + location + "\n" +
        "✅ Preferred Time Slot: " + timeSlot + "\n\n" +
        "**What’s Next?**\n" +
        "✔ Start receiving appointment requests from customers.\n" +
        "✔ Manage your schedule and service requests through your ServeEase.pro account.\n" +
        "✔ Provide top-quality service and grow your customer base!\n\n" +
        "You will be notified via email whenever a customer books an appointment with you. " +
        "Please ensure timely responses and excellent service to build trust with our community.\n\n" +
        "If you have any questions or need assistance, feel free to reach out to us at **servease01@gmail.com**.\n\n" +
        "Thank you for joining ServeEase.pro! We look forward to a successful partnership.\n\n" +
        "**Best regards,**\n" +
        "ServeEase.pro Team\n" +
        "📧 servease01@gmail.com\n" +
        "🌐 [Website URL]";

    MailApp.sendEmail(email, subject, message);
}
