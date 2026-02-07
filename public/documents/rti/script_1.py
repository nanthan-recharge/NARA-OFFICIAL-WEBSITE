
# Recreate the RTI forms structure for PDF generation
rti_forms = {
    "RTI-01": {
        "form_name": "Information Application Form",
        "form_title": "Application to receive Information",
        "fields": [
            "1. Name of Requestor",
            "2. Address",
            "3. Contact No. (if any)",
            "4. Email Address (if any)",
            "5. Details about Information requested:",
            "   I. Specific Public Authority",
            "   II. Information requested",
            "   III. Specific period information is requested (if applicable)",
            "6. Manner in which information is requested:",
            "   □ Inspect relevant work, documents, records",
            "   □ Take notes, extracts or certified copies",
            "   □ Take certified samples of material",
            "   □ Obtain information in electronic form",
            "7. Language preference: □ Sinhala  □ Tamil  □ English",
            "8. Does the information request concern the life and personal liberty of a citizen? □ Yes  □ No",
            "9. Any other details",
            "10. Relevant documents attached (If any)",
            "11. Is the requestor a citizen of Sri Lanka? □ Yes  □ No"
        ]
    },
    "RTI-03": {
        "form_name": "Register of Information Requests",
        "form_title": "Register of Information Requests",
        "is_register": True,
        "columns": [
            "Reg. No.", "Date", "Name & Address", "Contact", "Type of Information",
            "Date of Receipt", "Date of Decision", "Fee", "Date Provided", 
            "RTI-05 Date", "Manner Provided"
        ]
    },
    "RTI-04": {
        "form_name": "Decision to Provide Information",
        "form_title": "Decision to Provide Information",
        "content": [
            "Registration Number: _________________",
            "Date Request Received: _________________",
            "",
            "This is to inform you that we have decided to approve your request for information dated ________ with Registration Number ________.",
            "",
            "The manner in which information is to be provided:",
            "□ Inspect relevant work, documents, records",
            "□ Take notes, extracts or certified copies",
            "□ Take certified samples of material",
            "□ Obtain information in electronic form",
            "",
            "Fee Amount: Rs. __________",
            "",
            "We will provide you with the information within 14 days of payment of the required fee.",
            "",
            "If you are not satisfied, you may submit an appeal to the designated officer within two weeks using RTI-10 form."
        ]
    },
    "RTI-05": {
        "form_name": "Rejection of Information Request",
        "form_title": "Rejection of Information Request",
        "content": [
            "Registration Number: _________________",
            "Date Request Received: _________________",
            "",
            "This is to inform you that we have decided to reject your request for information dated ________ with Registration Number ________.",
            "",
            "Reasons for rejection:",
            "_______________________________________________________________",
            "_______________________________________________________________",
            "_______________________________________________________________",
            "",
            "You may prefer an appeal against this decision to the designated officer within 14 days using Form RTI-10."
        ]
    },
    "RTI-06": {
        "form_name": "Extension of Time to Provide Information",
        "form_title": "Extension of Time to Provide Information",
        "content": [
            "Registration Number: _________________",
            "Date Request Received: _________________",
            "",
            "Your request for information requires additional time to process.",
            "",
            "Original Deadline: _________________",
            "Extended Deadline: _________________",
            "Extension Period: ________ days",
            "",
            "Reasons for extension:",
            "_______________________________________________________________",
            "_______________________________________________________________",
            "",
            "This extension is granted under Section 24(3) of the Right to Information Act No. 12 of 2016."
        ]
    },
    "RTI-07": {
        "form_name": "Communication to Third Party",
        "form_title": "Communication to Third Party",
        "content": [
            "Name of Third Party: _________________",
            "Address: _________________",
            "Date: _________________",
            "",
            "Reference: Application Registration Number _________________",
            "",
            "Subject: Notice under Section 28 of the Right to Information Act No. 12 of 2016",
            "",
            "We have received a request for information that relates to you.",
            "",
            "You have the right to make representations against disclosure within ________ days.",
            "",
            "Response Deadline: _________________"
        ]
    },
    "RTI-09": {
        "form_name": "Register of Appeals",
        "form_title": "Register of Appeals under Right to Information Act No. 12 of 2016",
        "is_register": True,
        "columns": [
            "Appeal Reg. No.", "Appeal Date", "Original Request No.", "Appellant Name",
            "Address", "Grounds", "Appeal Type", "Decision Date", "Outcome", "Remarks"
        ]
    },
    "RTI-10": {
        "form_name": "Appeal to the Designated Officer",
        "form_title": "Appeal to the Designated Officer",
        "fields": [
            "1. Name of Person Appealing",
            "2. Address",
            "3. Contact Number (if any)",
            "4. Email Address (if any)",
            "5. Authorized representative details (if any)",
            "6. Name of Public Authority concerned",
            "7. Information Officer details",
            "8. Date request made and Registration Number",
            "9. Did you receive a reply? □ Yes  □ No",
            "10. Date of receipt of decision",
            "11. Grounds of Appeal:",
            "_______________________________________________________________",
            "_______________________________________________________________",
            "_______________________________________________________________",
            "12. Information Requested on Appeal",
            "13. Decision requested",
            "14. Cause of delay (if applicable)",
            "15. Previous appeal filed? □ Yes  □ No",
            "16. Other details",
            "17. Documents attached"
        ]
    },
    "RTI-11": {
        "form_name": "Register of Rejection of Requests",
        "form_title": "Register of Rejection of Information Requests",
        "is_register": True,
        "columns": [
            "Reg. No.", "Request Date", "Requestor Name", "Address", 
            "Information Requested", "Rejection Date", "Reason", "Section Cited",
            "Appeal Filed", "Appeal Outcome", "Remarks"
        ]
    },
    "RTI-12": {
        "form_name": "Details of Information Officers",
        "form_title": "Details of Information Officers and Designated Officers",
        "content": [
            "INFORMATION OFFICER DETAILS",
            "",
            "Name: _________________",
            "Designation: _________________",
            "Office Address: _________________",
            "Telephone: _________________",
            "Mobile: _________________",
            "Email: _________________",
            "Date of Appointment: _________________",
            "",
            "DESIGNATED OFFICER DETAILS",
            "",
            "Name: _________________",
            "Designation: _________________",
            "Office Address: _________________",
            "Telephone: _________________",
            "Mobile: _________________",
            "Email: _________________",
            "Date of Appointment: _________________"
        ]
    }
}

print(f"Created structure for {len(rti_forms)} RTI forms")
print("Forms ready for PDF generation:")
for form_id in rti_forms.keys():
    print(f"  • {form_id}: {rti_forms[form_id]['form_name']}")
