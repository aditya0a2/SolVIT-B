function sendEmail(e) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var lastRow = sheet.getLastRow();
    
    var name = sheet.getRange(lastRow, 3).getValue(); // Customer Name (Column C)
    var customerEmail = sheet.getRange(lastRow, 2).getValue(); // Customer Email (Column B)
    var serviceNeeded = sheet.getRange(lastRow, 6).getDisplayValue(); // Service Needed (Column F) - Dropdown
    var appointmentDate = sheet.getRange(lastRow, 7).getDisplayValue(); // Appointment Date (Column G)
    var appointmentTimeSlot = sheet.getRange(lastRow, 8).getDisplayValue(); // Preferred Time Slot (Column H) - Dropdown
    var location = sheet.getRange(lastRow, 9).getDisplayValue(); // Customer Address (Column I)
    var customerNumber = sheet.getRange(lastRow, 5).getDisplayValue(); // Customer Phone Number (Column E)

    // ✅ 1. Email to the Customer
    var customerSubject = "Reminder: Your Upcoming Appointment with " + serviceNeeded + " on " + appointmentDate;
    var customerMessage = "Dear " + name + ",\n\n" +
        "This is a friendly reminder from ServeEase.pro about your upcoming appointment for " + serviceNeeded + ".\n\n" +
        "📅 Date: " + appointmentDate + "\n" +
        "⏰ Time: " + appointmentTimeSlot + "\n" +
        "📍 Location: " + location + "\n\n" +
        "Please ensure someone is available at the scheduled time. If you need to reschedule or have any questions, " +
        "you can manage your appointment via your ServeEase.pro account.\n\n" +
        "Thank you for choosing ServeEase.pro!\n\n" +
        "Best regards,\n" +
        "ServeEase.pro Team\n" +
        "📧 servease01@gmail.com";

    if (customerEmail) {
        MailApp.sendEmail(customerEmail, customerSubject, customerMessage);
    }

    // ✅ 2. Email to the Service Provider
    var providerEmail = getProviderEmail(serviceNeeded);
    if (providerEmail) {
        var providerSubject = "New Appointment Scheduled via ServeEase.pro";
        var providerMessage = "Dear Provider,\n\n" + 
            "A new appointment has been scheduled through ServeEase.pro. Please find the details below:\n\n" +
            "📅 Date: " + appointmentDate + "\n" +
            "⏰ Time: " + appointmentTimeSlot + "\n" +
            "👤 Customer Name: " + name + "\n" +
            "📍 Location: " + location + "\n" +
            "📞 Contact: " + customerNumber + "\n" +
            "🛠️ Service Requested: " + serviceNeeded + "\n\n" +
            "Please ensure that you or your representative is available at the scheduled time. If you have any questions or need to reschedule, please contact the customer directly.\n\n" +
            "Thank you for being a valued service provider on ServeEase.pro!\n\n" +
            "Best regards,\n" +
            "ServeEase.pro Team\n" +
            
            "📧 servease01@gmail.com";

        MailApp.sendEmail(providerEmail, providerSubject, providerMessage);
    }

    // ✅ 3. Schedule the Appointment in Google Calendar
    scheduleCalendarEvent(appointmentDate, appointmentTimeSlot, serviceNeeded, location, name, customerNumber);
}

// 🔹 Function to Get Provider Email Based on Service Needed
function getProviderEmail(serviceNeeded) {
    var providerEmails = {
        "Appliance repair (200 Rs)": "rmishranarayan@gmail.com",
        "Home cleaning (300 Rs)": "sp6700585@gmail.com",
        "Lawn maintenance (200 Rs)": "adx.222005@gmail.com",
        "Electrician services (200 Rs)": "atharva13dixit@gmail.com",
        "Full service Car wash (100Rs)": "radiationrudranmishrasouth@gmail.com"
    };
    
    return providerEmails[serviceNeeded] || null;
}

// 🔹 Function to Schedule Google Calendar Event
function scheduleCalendarEvent(date, timeSlot, serviceNeeded, location, customerName, customerNumber) {
    var calendar = CalendarApp.getDefaultCalendar();

    // Extract Start & End Time from Dropdown (Format: "8:00 AM - 9:00 AM")
    var timeParts = timeSlot.split(" - ");
    var startTime = timeParts[0]; // "8:00 AM"
    var endTime = timeParts[1];   // "9:00 AM"

    // Convert Date & Time to JavaScript Date Object
    var formattedDate = new Date(date);
    var startDateTime = new Date(formattedDate.toDateString() + " " + startTime);
    var endDateTime = new Date(formattedDate.toDateString() + " " + endTime);

    // Create Calendar Event
    calendar.createEvent(
        "Service Appointment - " + serviceNeeded,
        startDateTime,
        endDateTime,
        {
            location: location,
            description: "Customer Name: " + customerName + "\n" +
                         "Phone: " + customerNumber + "\n" +
                         "Service: " + serviceNeeded + "\n\n" +
                         "Scheduled via ServeEase.pro"
        }
    );
}
