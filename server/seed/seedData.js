const schemesData = [
  {
    name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    code: 'PM-KISAN',
    ministry: 'Ministry of Agriculture and Farmers Welfare',
    department: 'Department of Agriculture and Farmers Welfare',
    category: 'Agriculture & Rural',
    level: 'Central',
    state: 'All India',
    description: 'An initiative by the Government of India to provide income support to all landholding farmer families across the country to enable them to take care of expenses related to agriculture and allied activities as well as domestic needs.',
    benefits: [
      'Financial benefit of ₹6,000 per year per eligible family.',
      'Transferred directly to bank accounts in three equal 4-monthly installments of ₹2,000.',
      '100% centrally funded scheme with transparent Direct Benefit Transfer (DBT).'
    ],
    benefitAmount: '₹6,000 / year (3 installments)',
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 100,
      gender: 'All',
      allowedStates: ['All India'],
      maxAnnualIncome: null,
      allowedOccupations: ['Farmer'],
      allowedCategories: ['All'],
      educationLevelRequired: ['All'],
      maritalStatus: ['All'],
      disabilityRequired: false,
      customRules: [
        'Must hold cultivable agricultural land in their name.',
        'Institutional landholders and serving/retired government officers are excluded.'
      ]
    },
    documentsRequired: [
      { name: 'Aadhaar Card', mandatory: true, description: 'Mandatory Aadhaar authentication linked to bank account' },
      { name: 'Landholding Proof (Khatauni / Patta)', mandatory: true, description: 'Official land revenue record proving ownership' },
      { name: 'Active Bank Passbook', mandatory: true, description: 'Bank account with NPCI Aadhaar seeding' },
      { name: 'Mobile Number', mandatory: true, description: 'Linked with Aadhaar for OTP verification' }
    ],
    applicationProcess: {
      mode: 'Online',
      steps: [
        'Visit the official PM-KISAN portal (pmkisan.gov.in).',
        'Navigate to Farmers Corner and select New Farmer Registration.',
        'Enter Aadhaar number and select state to verify eligibility.',
        'Provide landholding and bank account details, then submit OTP.',
        'Track application status via Beneficiary Status module.'
      ],
      officialPortalUrl: 'https://pmkisan.gov.in'
    },
    officialWebsite: 'https://pmkisan.gov.in',
    helpline: '155261 / 011-24300606 (PM-Kisan Helpline)',
    tags: ['farmer', 'agriculture', 'income-support', 'kisan', 'dbt'],
    featured: true,
    active: true
  },
  {
    name: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB PM-JAY)',
    code: 'PM-JAY',
    ministry: 'Ministry of Health and Family Welfare',
    department: 'National Health Authority (NHA)',
    category: 'Health & Wellness',
    level: 'Central',
    state: 'All India',
    description: 'The world\'s largest government-funded health assurance scheme providing secondary and tertiary care hospitalization coverage to over 50 crore vulnerable Indian citizens and low-income families.',
    benefits: [
      'Cashless health cover up to ₹5,00,000 per family per year.',
      'Covers pre-existing illnesses from day one of enrollment.',
      'Provides cashless access to over 27,000 empaneled public and private hospitals across India.',
      'Covers up to 3 days of pre-hospitalization and 15 days post-hospitalization expenses.'
    ],
    benefitAmount: '₹5,00,000 per family / year',
    eligibilityCriteria: {
      minAge: 0,
      maxAge: 120,
      gender: 'All',
      allowedStates: ['All India'],
      maxAnnualIncome: 250000,
      allowedOccupations: ['Daily Wage Worker / Labour', 'Farmer', 'Street Vendor', 'Artisan / Craftsman', 'Unemployed', 'Other'],
      allowedCategories: ['All'],
      educationLevelRequired: ['All'],
      maritalStatus: ['All'],
      disabilityRequired: false,
      customRules: [
        'Identified based on SECC (Socio-Economic Caste Census) deprivation criteria.',
        'Families holding active BPL / Antyodaya ration cards are eligible.'
      ]
    },
    documentsRequired: [
      { name: 'Aadhaar Card', mandatory: true, description: 'Identity verification for all family members' },
      { name: 'Ration Card / Family ID', mandatory: true, description: 'Proof of family composition and economic status' },
      { name: 'Income Certificate', mandatory: false, description: 'Issued by Tehsildar or Sub-Divisional Magistrate' }
    ],
    applicationProcess: {
      mode: 'Both',
      steps: [
        'Check family eligibility on the Mera PM-JAY portal using mobile or ration card number.',
        'Visit nearest Common Service Centre (CSC) or empaneled hospital Ayushman Mitra desk.',
        'Complete biometric or OTP verification.',
        'Download the instant Ayushman PVC Golden Card.'
      ],
      officialPortalUrl: 'https://mera.pmjay.gov.in'
    },
    officialWebsite: 'https://nha.gov.in/PM-JAY',
    helpline: '14555 (Toll Free National Health Authority)',
    tags: ['healthcare', 'health insurance', 'cashless', 'medical', 'hospitalization'],
    featured: true,
    active: true
  },
  {
    name: 'Pradhan Mantri Awas Yojana - Gramin (PMAY-G)',
    code: 'PMAY-G',
    ministry: 'Ministry of Rural Development',
    department: 'Rural Housing Division',
    category: 'Housing & Shelter',
    level: 'Central',
    state: 'All India',
    description: 'A flagship rural housing initiative aiming to provide pucca houses with basic amenities to all houseless households and those living in kutcha and dilapidated houses in rural India.',
    benefits: [
      'Financial assistance of ₹1,20,000 in plain areas and ₹1,30,000 in hilly/difficult/North-Eastern states.',
      'Additional 90/95 person days of unskilled labor wages under MGNREGS (approx. ₹20,000).',
      'Assistance of ₹12,000 for constructing a clean toilet under Swachh Bharat Mission (SBM-G).',
      'Free LPG connection under PM Ujjwala Yojana.'
    ],
    benefitAmount: 'Up to ₹1,50,000 total package',
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 100,
      gender: 'All',
      allowedStates: ['All India'],
      maxAnnualIncome: 180000,
      allowedOccupations: ['Daily Wage Worker / Labour', 'Farmer', 'Artisan / Craftsman', 'Street Vendor', 'Unemployed', 'Other'],
      allowedCategories: ['All'],
      educationLevelRequired: ['All'],
      maritalStatus: ['All'],
      disabilityRequired: false,
      customRules: [
        'Must not own a pucca house anywhere in India.',
        'Selection prioritized for houseless, SC/ST, and single women households.'
      ]
    },
    documentsRequired: [
      { name: 'Aadhaar Card', mandatory: true, description: 'Identity verification of household head' },
      { name: 'Bank Account Passbook', mandatory: true, description: 'Aadhaar linked account for DBT installments' },
      { name: 'MGNREGA Job Card', mandatory: true, description: 'For receiving unskilled labor wage component' },
      { name: 'Affidavit of No Pucca House', mandatory: true, description: 'Self declaration verified by Gram Panchayat' }
    ],
    applicationProcess: {
      mode: 'Both',
      steps: [
        'Beneficiary list is formulated through Gram Sabha verification of SECC database.',
        'Gram Rozgar Sevak registers the beneficiary on the AwaasSoft portal with geolocation photos.',
        'Three geo-tagged inspection stages before releasing installment tranches directly to bank account.'
      ],
      officialPortalUrl: 'https://pmayg.nic.in'
    },
    officialWebsite: 'https://pmayg.nic.in',
    helpline: '1800-11-6446 (Toll Free PMAY-G)',
    tags: ['housing', 'rural', 'pucca-ghar', 'gramin', 'subsidy'],
    featured: true,
    active: true
  },
  {
    name: 'Sukanya Samriddhi Yojana (SSY)',
    code: 'SSY',
    ministry: 'Ministry of Finance',
    department: 'Department of Economic Affairs',
    category: 'Women & Child',
    level: 'Central',
    state: 'All India',
    description: 'A government-backed savings scheme launched as part of the "Beti Bachao, Beti Padhao" campaign, targeted at the parents or guardians of a girl child to encourage savings for her higher education and marriage.',
    benefits: [
      'High government sovereign interest rate (currently 8.2% per annum compounding annually).',
      'Triple tax benefit under Section 80C of IT Act: EEE (Exempt on Investment, Interest, and Maturity).',
      'Minimum deposit of only ₹250 per financial year and up to ₹1,50,000 maximum deposit.',
      'Partial withdrawal of up to 50% allowed for girl\'s higher education after age 18.'
    ],
    benefitAmount: 'High 8.2% Sovereign Interest + Tax Free Returns',
    eligibilityCriteria: {
      minAge: 0,
      maxAge: 10,
      gender: 'Female',
      allowedStates: ['All India'],
      maxAnnualIncome: null,
      allowedOccupations: ['All'],
      allowedCategories: ['All'],
      educationLevelRequired: ['All'],
      maritalStatus: ['Single'],
      disabilityRequired: false,
      customRules: [
        'Account must be opened before the girl child reaches 10 years of age.',
        'Maximum 2 accounts per family (one for each girl child, up to 3 in case of twin/triplet births).'
      ]
    },
    documentsRequired: [
      { name: 'Birth Certificate of Girl Child', mandatory: true, description: 'Issued by hospital or municipal authority' },
      { name: 'Identity Proof of Guardian', mandatory: true, description: 'Aadhaar / PAN Card / Voter ID of parent' },
      { name: 'Address Proof of Guardian', mandatory: true, description: 'Electricity bill / Passport / Ration card' }
    ],
    applicationProcess: {
      mode: 'Offline',
      steps: [
        'Obtain SSY account opening form from any Post Office or authorized commercial bank branch.',
        'Fill details of girl child and parents/guardians.',
        'Submit the form along with initial deposit (minimum ₹250) and required documents.',
        'Receive SSY passbook for future deposits and record keeping.'
      ],
      officialPortalUrl: 'https://www.indiapost.gov.in'
    },
    officialWebsite: 'https://www.nsiindia.gov.in',
    helpline: '1800-266-6868 (India Post National Helpline)',
    tags: ['girl-child', 'savings', 'women-empowerment', 'tax-free', 'education'],
    featured: true,
    active: true
  },
  {
    name: 'Pradhan Mantri Mudra Yojana (PMMY)',
    code: 'PMMY',
    ministry: 'Ministry of Finance',
    department: 'Department of Financial Services',
    category: 'Business & MSME',
    level: 'Central',
    state: 'All India',
    description: 'A scheme providing collateral-free microloans up to ₹10 Lakhs to non-corporate, non-farm small and micro enterprises to boost entrepreneurship, self-employment, and small businesses.',
    benefits: [
      'Collateral-free loans categorized into Shishu (up to ₹50,000), Kishore (₹50,000 to ₹5 Lakh), and Tarun (₹5 Lakh to ₹10 Lakh).',
      'Low interest rates with no processing fees for Shishu category.',
      'Flexible repayment tenures up to 5 to 7 years.',
      'Comes with a Mudra Debit Card for working capital cash credit.'
    ],
    benefitAmount: 'Collateral-free loans up to ₹10,00,000',
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 65,
      gender: 'All',
      allowedStates: ['All India'],
      maxAnnualIncome: null,
      allowedOccupations: ['Self-Employed / Business', 'Artisan / Craftsman', 'Street Vendor', 'Other'],
      allowedCategories: ['All'],
      educationLevelRequired: ['All'],
      maritalStatus: ['All'],
      disabilityRequired: false,
      customRules: [
        'Must have a viable business proposal for manufacturing, processing, trading, or service sector.',
        'Borrower should not be a defaulter to any bank or financial institution.'
      ]
    },
    documentsRequired: [
      { name: 'Aadhaar & PAN Card', mandatory: true, description: 'Identity and tax identification' },
      { name: 'Business Enterprise Proof', mandatory: true, description: 'Udyam Registration / Trade License / GSTIN (if applicable)' },
      { name: 'Bank Statement', mandatory: true, description: 'Last 6 months bank account statements' },
      { name: 'Business Project Report', mandatory: false, description: 'Project report with cost estimates for Kishore and Tarun loans' }
    ],
    applicationProcess: {
      mode: 'Both',
      steps: [
        'Apply online on the Udyamimitra portal (udyamimitra.in) or visit any commercial bank/NBFC.',
        'Select the loan category: Shishu, Kishore, or Tarun based on fund requirement.',
        'Submit business profile, quotations for machinery/inventory, and KYC papers.',
        'Loan sanctions typically within 7-14 business days.'
      ],
      officialPortalUrl: 'https://www.udyamimitra.in'
    },
    officialWebsite: 'https://www.mudra.org.in',
    helpline: '1800-180-1111 / 1800-11-0001 (National MUDRA Toll-free)',
    tags: ['business', 'loan', 'msme', 'startup', 'collateral-free', 'entrepreneur'],
    featured: true,
    active: true
  },
  {
    name: 'National Scholarship Portal — Post Matric Scholarship for SC/ST/OBC Students',
    code: 'NSP-PMS',
    ministry: 'Ministry of Social Justice and Empowerment',
    department: 'Department of Social Justice and Empowerment',
    category: 'Education & Learning',
    level: 'Central',
    state: 'All India',
    description: 'Centrally sponsored scholarship scheme providing comprehensive financial assistance to meritorious and underprivileged students from SC, ST, and OBC categories pursuing higher secondary, undergraduate, or postgraduate education.',
    benefits: [
      'Full reimbursement of compulsory non-refundable course fees paid to college or university.',
      'Monthly maintenance allowance ranging from ₹550 to ₹1,200 per month.',
      'Book bank grant, thesis typing grant, and study tour allowances for technical/professional degrees.',
      'Additional disability allowance for specially-abled scholars.'
    ],
    benefitAmount: 'Full Tuition Waiver + Up to ₹14,400 / year allowance',
    eligibilityCriteria: {
      minAge: 16,
      maxAge: 35,
      gender: 'All',
      allowedStates: ['All India'],
      maxAnnualIncome: 250000,
      allowedOccupations: ['Student'],
      allowedCategories: ['SC', 'ST', 'OBC'],
      educationLevelRequired: ['10th Pass', '12th Pass', 'Diploma / ITI', 'Graduate', 'Post Graduate'],
      maritalStatus: ['All'],
      disabilityRequired: false,
      customRules: [
        'Must be enrolled in a recognized post-matric course in a government or approved private institution.',
        'Total parental/family annual income must not exceed ₹2,50,000 per annum.'
      ]
    },
    documentsRequired: [
      { name: 'Caste Certificate', mandatory: true, description: 'Digitally verifiable caste certificate issued by competent authority' },
      { name: 'Income Certificate', mandatory: true, description: 'Annual family income certificate valid for current financial year' },
      { name: 'College Admission Fee Receipt', mandatory: true, description: 'Official current semester enrollment receipt' },
      { name: 'Previous Academic Marksheet', mandatory: true, description: 'Proof of passing qualifying examination' },
      { name: 'Aadhaar Seeded Bank Account', mandatory: true, description: 'Direct Benefit Transfer compliant bank passbook' }
    ],
    applicationProcess: {
      mode: 'Online',
      steps: [
        'Register with Aadhaar and academic OTR (One Time Registration) on scholarships.gov.in.',
        'Fill student academic and category profile.',
        'Upload scanned documents and submit application before deadline.',
        'Application is verified by Institute Nodal Officer, followed by District and State Welfare Officers.'
      ],
      officialPortalUrl: 'https://scholarships.gov.in'
    },
    officialWebsite: 'https://scholarships.gov.in',
    helpline: '0120-6619540 (NSP Helpdesk)',
    tags: ['scholarship', 'students', 'higher-education', 'college', 'tuition-fee', 'sc-st-obc'],
    featured: true,
    active: true
  },
  {
    name: 'Atal Pension Yojana (APY)',
    code: 'APY',
    ministry: 'Ministry of Finance',
    department: 'Pension Fund Regulatory and Development Authority (PFRDA)',
    category: 'Social Welfare & Empowerment',
    level: 'Central',
    state: 'All India',
    description: 'A national pension scheme focused on the unorganized sector workers to help them voluntarily save for their retirement and secure a guaranteed monthly pension after age 60.',
    benefits: [
      'Guaranteed minimum monthly pension of ₹1,000, ₹2,000, ₹3,000, ₹4,000, or ₹5,000 per month after age 60.',
      'Sovereign guarantee by Government of India ensuring safety of pension corpus.',
      'Spouse receives the same pension amount upon demise of subscriber.',
      'Nominee receives entire accumulated pension wealth after death of subscriber and spouse.'
    ],
    benefitAmount: 'Guaranteed ₹1,000 to ₹5,000 / month pension',
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 40,
      gender: 'All',
      allowedStates: ['All India'],
      maxAnnualIncome: null,
      allowedOccupations: [
        'Daily Wage Worker / Labour',
        'Farmer',
        'Street Vendor',
        'Artisan / Craftsman',
        'Self-Employed / Business',
        'Homemaker',
        'Other'
      ],
      allowedCategories: ['All'],
      educationLevelRequired: ['All'],
      maritalStatus: ['All'],
      disabilityRequired: false,
      customRules: [
        'Must be between 18 and 40 years of age at the time of entry.',
        'Must have an active savings bank account with auto-debit facility.',
        'Subscriber should not be an income taxpayer as per recent government mandate.'
      ]
    },
    documentsRequired: [
      { name: 'Aadhaar Card', mandatory: true, description: 'Primary identity verification' },
      { name: 'Savings Bank Account Passbook', mandatory: true, description: 'Bank account enabled for monthly auto-debit' },
      { name: 'Nominee Details', mandatory: true, description: 'Name and date of birth of legal nominee' }
    ],
    applicationProcess: {
      mode: 'Both',
      steps: [
        'Approach bank branch or post office where savings bank account is maintained.',
        'Fill APY registration form specifying chosen monthly pension amount (₹1,000 - ₹5,000).',
        'Enable auto-debit for monthly or quarterly contribution.',
        'Receive Permanent Retirement Account Number (PRAN) confirmation SMS.'
      ],
      officialPortalUrl: 'https://enps.nsdl.com'
    },
    officialWebsite: 'https://www.npscra.nsdl.co.in/atal-pension-yojana.php',
    helpline: '1800-110-069 (PFRDA APY Toll Free)',
    tags: ['pension', 'senior-citizen', 'retirement', 'unorganized-sector', 'social-security'],
    featured: false,
    active: true
  },
  {
    name: 'PM Street Vendor’s AtmaNirbhar Nidhi (PM SVANidhi)',
    code: 'PM-SVANIDHI',
    ministry: 'Ministry of Housing and Urban Affairs',
    department: 'Urban Poverty Alleviation Division',
    category: 'Business & MSME',
    level: 'Central',
    state: 'All India',
    description: 'A special micro-credit facility providing affordable working capital loans to urban and peri-urban street vendors to restart their livelihoods post-pandemic and embrace digital transactions.',
    benefits: [
      'Initial working capital loan of ₹10,000 with 1-year tenure.',
      'Enhanced 2nd tranche of ₹20,000 and 3rd tranche of ₹50,000 on timely repayments.',
      '7% interest subsidy credited directly to bank account on quarterly basis.',
      'Monthly cashback incentive up to ₹100 for digital payments acceptance.'
    ],
    benefitAmount: '₹10,000 to ₹50,000 working capital + 7% interest subsidy',
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 70,
      gender: 'All',
      allowedStates: ['All India'],
      maxAnnualIncome: null,
      allowedOccupations: ['Street Vendor', 'Artisan / Craftsman', 'Daily Wage Worker / Labour'],
      allowedCategories: ['All'],
      educationLevelRequired: ['All'],
      maritalStatus: ['All'],
      disabilityRequired: false,
      customRules: [
        'Must possess Certificate of Vending or Identity Card issued by Urban Local Body (ULB).',
        'Vendors with Letter of Recommendation (LoR) from Town Vending Committee are also eligible.'
      ]
    },
    documentsRequired: [
      { name: 'Aadhaar Card', mandatory: true, description: 'Identity verification' },
      { name: 'Vending Certificate or ID Card', mandatory: true, description: 'Issued by Municipality or Nagar Nigam' },
      { name: 'Bank Passbook Copy', mandatory: true, description: 'For loan disbursement and interest subsidy credit' }
    ],
    applicationProcess: {
      mode: 'Online',
      steps: [
        'Visit pmsvanidhi.mohua.gov.in or download the PM SVANidhi mobile app.',
        'Enter mobile number linked with Aadhaar and enter OTP.',
        'Select vending status (ULB ID card or Letter of Recommendation).',
        'Choose preferred lending institution and submit request.'
      ],
      officialPortalUrl: 'https://pmsvanidhi.mohua.gov.in'
    },
    officialWebsite: 'https://pmsvanidhi.mohua.gov.in',
    helpline: '1800-11-1979 (PM SVANidhi Support)',
    tags: ['street-vendors', 'micro-credit', 'loan', 'urban-livelihood', 'digital-india'],
    featured: false,
    active: true
  },
  {
    name: 'Pradhan Mantri Ujjwala Yojana (PMUY 2.0)',
    code: 'PMUY',
    ministry: 'Ministry of Petroleum and Natural Gas',
    department: 'Marketing Division',
    category: 'Social Welfare & Empowerment',
    level: 'Central',
    state: 'All India',
    description: 'A social welfare program providing deposit-free LPG gas connections to women from below-poverty-line and disadvantaged households to protect their health from smoky indoor cooking fires.',
    benefits: [
      'Deposit-free LPG connection with security deposit for cylinder and pressure regulator borne by Government.',
      'Free first LPG refill along with a complimentary hotplate (gas stove).',
      'Direct subsidy of ₹300 per 14.2 kg LPG cylinder directly to bank account for up to 12 refills per year.'
    ],
    benefitAmount: 'Free LPG Connection & Stove + ₹300 Subsidy/Cylinder',
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 90,
      gender: 'Female',
      allowedStates: ['All India'],
      maxAnnualIncome: 150000,
      allowedOccupations: ['Homemaker', 'Daily Wage Worker / Labour', 'Farmer', 'Other'],
      allowedCategories: ['All'],
      educationLevelRequired: ['All'],
      maritalStatus: ['All'],
      disabilityRequired: false,
      customRules: [
        'Applicant must be an adult woman (at least 18 years of age).',
        'No other LPG connection must exist in the applicant\'s household.'
      ]
    },
    documentsRequired: [
      { name: 'Aadhaar of Adult Woman Applicant', mandatory: true, description: 'Identity and address proof' },
      { name: 'Ration Card', mandatory: true, description: 'Supporting family composition list' },
      { name: 'Aadhaar of all Adult Family Members', mandatory: true, description: 'Listed in ration card to prevent duplicates' },
      { name: 'Bank Passbook / IFSC', mandatory: true, description: 'For receiving DBT subsidy' }
    ],
    applicationProcess: {
      mode: 'Both',
      steps: [
        'Apply online on pmuy.gov.in or visit local LPG distributor (Indane, BharatGas, or HP Gas).',
        'Fill standard 14-point declaration and furnish family KYC.',
        'Connection is inspected and released within 7 working days.'
      ],
      officialPortalUrl: 'https://www.pmuy.gov.in'
    },
    officialWebsite: 'https://www.pmuy.gov.in',
    helpline: '1800-266-6696 (Ujjwala Helpline) / 1906 (LPG Emergency)',
    tags: ['women', 'clean-energy', 'lpg', 'subsidy', 'health', 'rural-welfare'],
    featured: false,
    active: true
  },
  {
    name: 'PM Vishwakarma Scheme',
    code: 'PM-VISHWAKARMA',
    ministry: 'Ministry of Micro, Small and Medium Enterprises',
    department: 'MSME Development Institute',
    category: 'Skills & Employment',
    level: 'Central',
    state: 'All India',
    description: 'A comprehensive central scheme dedicated to empowering traditional artisans and craftsmen who work with their hands and tools across 18 designated traditional trades.',
    benefits: [
      'PM Vishwakarma Certificate and ID Card recognizing certified artisan status.',
      'Basic skill training of 5-7 days and advanced training of 15+ days with daily stipend of ₹500.',
      'Modern Toolkit incentive of ₹15,000 in electronic voucher form.',
      'Collateral-free enterprise credit: 1st tranche up to ₹1 Lakh and 2nd tranche up to ₹2 Lakh at concessional 5% interest rate.'
    ],
    benefitAmount: '₹15,000 Toolkit + ₹3 Lakh Concessional Loan + ₹500/day Stipend',
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 75,
      gender: 'All',
      allowedStates: ['All India'],
      maxAnnualIncome: null,
      allowedOccupations: ['Artisan / Craftsman', 'Self-Employed / Business', 'Daily Wage Worker / Labour'],
      allowedCategories: ['All'],
      educationLevelRequired: ['All'],
      maritalStatus: ['All'],
      disabilityRequired: false,
      customRules: [
        'Must be engaged in one of the 18 traditional trades (Carpenter, Blacksmith, Potter, Sculptor, Cobbler, Tailor, Barber, Washerman, etc.).',
        'Applicant should not have availed credit under PMEGP, PM SVANidhi, or Mudra in the last 5 years.',
        'Limited to one member per family.'
      ]
    },
    documentsRequired: [
      { name: 'Aadhaar Card', mandatory: true, description: 'Biometric verified identity' },
      { name: 'Mobile Number', mandatory: true, description: 'Linked with Aadhaar' },
      { name: 'Bank Account Details', mandatory: true, description: 'Active account for training stipend and loan disbursement' },
      { name: 'Trade Proof / Panchayat Recommendation', mandatory: true, description: 'Verification by Gram Panchayat Pradhan or ULB' }
    ],
    applicationProcess: {
      mode: 'Online',
      steps: [
        'Visit nearest Common Service Centre (CSC) with biometric verification.',
        'Enroll for the specified traditional trade on the PM Vishwakarma portal.',
        'Stage 1 Gram Panchayat verification, followed by District and National Screening Committee.',
        'Undergo basic skill development training at recognized training center and collect toolkit voucher.'
      ],
      officialPortalUrl: 'https://pmvishwakarma.gov.in'
    },
    officialWebsite: 'https://pmvishwakarma.gov.in',
    helpline: '1800-267-7777 / 011-23061500 (MSME Helpdesk)',
    tags: ['artisans', 'craftsmen', 'skill-training', 'toolkit', 'concessional-loan', 'traditional-trades'],
    featured: true,
    active: true
  },
  {
    name: 'Stand-Up India Scheme for Women and SC/ST Entrepreneurs',
    code: 'STANDUP-INDIA',
    ministry: 'Ministry of Finance',
    department: 'Department of Financial Services',
    category: 'Financial Inclusion',
    level: 'Central',
    state: 'All India',
    description: 'Facilitates bank loans between ₹10 Lakh and ₹1 Crore to at least one Scheduled Caste (SC) or Scheduled Tribe (ST) borrower and at least one woman borrower per bank branch for setting up a greenfield enterprise.',
    benefits: [
      'Composite bank loan between ₹10 Lakh and ₹1 Crore covering term loan and working capital.',
      'Margin money requirement reduced to 15% with convergence of other central/state subsidy schemes.',
      'Pre-loan handholding support through SIDBI, NABARD, and District Industries Centres (DIC).'
    ],
    benefitAmount: 'Bank loans from ₹10 Lakh up to ₹1 Crore',
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 70,
      gender: 'All',
      allowedStates: ['All India'],
      maxAnnualIncome: null,
      allowedOccupations: ['Self-Employed / Business', 'Artisan / Craftsman', 'Other'],
      allowedCategories: ['SC', 'ST', 'All'],
      educationLevelRequired: ['10th Pass', '12th Pass', 'Diploma / ITI', 'Graduate', 'Post Graduate'],
      maritalStatus: ['All'],
      disabilityRequired: false,
      customRules: [
        'Borrower must be a Woman OR an SC/ST individual.',
        'For non-individual enterprises, 51% of shareholding and controlling stake must be held by SC/ST or Woman entrepreneur.',
        'Must be for a greenfield enterprise (first time venture in manufacturing, services, agri-allied, or trading).'
      ]
    },
    documentsRequired: [
      { name: 'Identity & Address Proof', mandatory: true, description: 'Aadhaar, PAN Card, Voter ID' },
      { name: 'Caste Certificate', mandatory: false, description: 'Required for SC/ST applicants; not required for general women applicants' },
      { name: 'Detailed Project Report (DPR)', mandatory: true, description: 'Business viability, market feasibility, and financial projections' },
      { name: 'Greenfield Enterprise Lease / Land Deed', mandatory: true, description: 'Proof of premises where business is to be established' }
    ],
    applicationProcess: {
      mode: 'Online',
      steps: [
        'Register on the Stand-Up India portal (standupmitra.in).',
        'Fill loan application form and choose between "Trainee Borrower" (needs handholding) or "Ready Borrower".',
        'Select preferred bank branch and submit project report.',
        'Participate in bank appraisal and loan sanctioning interview.'
      ],
      officialPortalUrl: 'https://www.standupmitra.in'
    },
    officialWebsite: 'https://www.standupmitra.in',
    helpline: '1800-180-1111 (Stand-Up India Toll Free)',
    tags: ['women-entrepreneurs', 'sc-st', 'greenfield-loans', 'sidbi', 'startup', 'industrial-finance'],
    featured: false,
    active: true
  },
  {
    name: 'Pradhan Mantri Divyangjan Swavalamban Yojana',
    code: 'PM-DIVYANG',
    ministry: 'Ministry of Social Justice and Empowerment',
    department: 'Department of Empowerment of Persons with Disabilities (DEPwD)',
    category: 'Social Welfare & Empowerment',
    level: 'Central',
    state: 'All India',
    description: 'A dedicated empowerment scheme providing concessional loans and financial assistance to persons with disabilities (PwDs) for vocational training, self-employment ventures, and assistive technologies.',
    benefits: [
      'Concessional loans up to ₹5,00,000 for starting micro-enterprises or agricultural activities at 4% - 6% interest.',
      'Rebate of 0.5% - 1% interest for prompt repayments and woman PwD beneficiaries.',
      '100% subsidy on purchase of motorized tricycles, hearing aids, braille laptops, and assistive equipment under ADIP.'
    ],
    benefitAmount: 'Concessional loans up to ₹5,00,000 + Free Assistive Devices',
    eligibilityCriteria: {
      minAge: 18,
      maxAge: 65,
      gender: 'All',
      allowedStates: ['All India'],
      maxAnnualIncome: 300000,
      allowedOccupations: ['All'],
      allowedCategories: ['All'],
      educationLevelRequired: ['All'],
      maritalStatus: ['All'],
      disabilityRequired: true,
      minDisabilityPercentage: 40,
      customRules: [
        'Must possess a valid Unique Disability ID (UDID) card or disability certificate with 40% or more benchmark disability.'
      ]
    },
    documentsRequired: [
      { name: 'UDID Card / Disability Certificate', mandatory: true, description: 'Issued by District Medical Board (minimum 40% disability)' },
      { name: 'Aadhaar Card', mandatory: true, description: 'National identity verification' },
      { name: 'Income Certificate', mandatory: true, description: 'Certifying annual family income below ₹3 Lakh' },
      { name: 'Self-employment Business Proposal', mandatory: true, description: 'Brief outline of proposed commercial activity' }
    ],
    applicationProcess: {
      mode: 'Online',
      steps: [
        'Apply on the National Handicapped Finance and Development Corporation (NHFDC) portal or State Channelizing Agency.',
        'Submit UDID card details and project estimate.',
        'State screening committee clears the file and disburses subsidy/loan via partner nationalized banks.'
      ],
      officialPortalUrl: 'https://www.nhfdc.nic.in'
    },
    officialWebsite: 'https://disabilityaffairs.gov.in',
    helpline: '011-24364012 (DEPwD Support)',
    tags: ['divyangjan', 'disability', 'assistive-devices', 'udid', 'concessional-loan', 'accessible-india'],
    featured: false,
    active: true
  }
];

module.exports = schemesData;
