export const stateOfUs = [
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
    'District of Colombia',
    'Florida',
    'Georgia',
    'Hawaii',
    'Idaho',
    'Illinois',
    'Indiana',
    'Iowa',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Maine',
    'Maryland',
    'Massachusetts',
    'Michigan',
    'Minnesota',
    'Mississippi',
    'Missouri',
    'Montana',
    'Nebraska',
    'Nevada',
    'New Hampshire',
    'New Jersey',
    'New Mexico',
    'New York',
    'North Carolina',
    'North Dakota',
    'Ohio',
    'Oklahoma',
    'Oregon',
    'Pennsylvania',
    'Rhode Island',
    'South Carolina',
    'South Dakota',
    'Tennessee',
    'Texas',
    'Utah',
    'Vermont',
    'Virginia',
    'Washington',
    'West Virginia',
    'Wisconsin',
    'Wyoming'
];

export const agreementData = (fullName) => {
    const date = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return `This Agreement (the “Agreement”) entered into this ${date.getDate()} day of ${monthNames[date.getMonth()]}, ${date.getFullYear()} (“Effective Date – ${(date.getMonth() + 1)}/${date.getDate()}/${date.getFullYear()}”),
    by and between LINKHEALTHSTAFF LLC (“LHS”), a Nevada registered corporation with its corporate office
    located Los Angeles, CA, and ${fullName} (hereinafter referred to as “MEDICAL STAFF/PERSONNEL”).
    WHEREAS, LHS operates an on-demand healthcare staffing platform that facilitates hiring of healthcare
    personnel to provide services to MEDICAL FACILITIES. WHEREAS, LHS Platform desires to facilitate acquisition
    services of a Medical Professional set forth in this agreement in accordance with the terms and conditions of
    the MEDICAL FACILITY job posting. NOW THEREFORE, in consideration of the mutual promises and covenants between LHS and
    HEALTHCARE PERSONNEL, (jointly hereinafter referred to as “Party/Parties”), the Parties hereby agree:  The Medical Professional is a licensed and duly qualified to perform the services expected within the disciplines
    and job description in the State where healthcare services are being requested. The Medical Professional shall
    report to the Medical Facility assigned on time as requested by the Medical Facility for the services requested
    on the LHS Platform.  The term of this Agreement is for a period of one (1) year from and automatically renewed every year thereafter
    unless terminated by either party. This Agreement may be reviewed and revised as necessary.   Notwithstanding the foregoing, this Agreement may be terminated by either party anytime. 
    The Medical Professional acknowledges that only the LHS Platform is authorized to bill for service rendered by
    the Medical Professional to all Medical Facilities served by the Medical Professional. Medical Professional
    acknowledges that only licensed and qualified personnel will be accepted by LHS Platform for service. At the
    completion of the Medical Professional’s agreed to shift, the Medical Professional shall provide documentation
    to be reviewed by the LHS Platform prior to payment. If any discrepancies are found, the LHS Platform shall 
    advise the Medical Professional to correct deficiencies noted in the course of such review. Payment to the Medical
    Professional shall be in accordance with schedule of the LHS Platform that is immediately after submission of notes
    and documentation after successful completion of medical shift. Delayed notes and documentation, including
    deficiencies, shall delay payments until correction shall have been made. LHS Platform reserves the right to
    require the Medical Professional to correct notes and documentation found to be deficient.`
}