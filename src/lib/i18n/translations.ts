export type Locale = "en" | "my";

export interface Translations {
  // Navigation & Header
  nav: {
    brandSubtitle: string;
    signIn: string;
    account: string;
    admin: string;
    cart: string;
    language: string;
    themeLight: string;
    themeDark: string;
    unreadNotifications: string;
  };
  // Hero & Home
  home: {
    badge: string;
    title: string;
    description: string;
    allInventory: string;
    newParts: string;
    secondhand: string;
    searchPlaceholder: string;
    noResults: string;
  };
  // Product Card & Catalog
  product: {
    inStock: string;
    outOfStock: string;
    unitsInStock: string;
    conditionNew: string;
    conditionSecondhand: string;
    price: string;
    addToCart: string;
    added: string;
    backToInventory: string;
    specifications: string;
    quantity: string;
    subtotal: string;
    total: string;
    details: string;
  };
  // Cart
  cart: {
    title: string;
    emptyTitle: string;
    emptySubtitle: string;
    browseInventory: string;
    itemCount: string;
    itemsCount: string;
    subtotal: string;
    shipping: string;
    freeShipping: string;
    total: string;
    clearCart: string;
    proceedToCheckout: string;
    remove: string;
  };
  // Checkout
  checkout: {
    title: string;
    subtitle: string;
    orderSummary: string;
    kpayInstructionsTitle: string;
    kpayInstructionsSubtitle: string;
    kpayStep1: string;
    kpayStep2: string;
    kpayStep2Phone: string;
    kpayStep2Name: string;
    kpayStep3: string;
    kpayStep3Upload: string;
    kpayStep3Drag: string;
    kpayStep3Formats: string;
    customerInfoTitle: string;
    customerInfoSubtitle: string;
    fullName: string;
    fullNamePlaceholder: string;
    phoneNumber: string;
    phoneNumberPlaceholder: string;
    deliveryAddress: string;
    deliveryAddressPlaceholder: string;
    placeOrderBtn: string;
    processingOrder: string;
    fillAllFieldsError: string;
    uploadSlipError: string;
  };
  // Order Success
  orderSuccess: {
    title: string;
    subtitle: string;
    orderId: string;
    statusPending: string;
    statusPendingDesc: string;
    shippingDetails: string;
    itemsOrdered: string;
    totalPaid: string;
    backToStore: string;
    viewInProfile: string;
    qty: string;
  };
  // Profile
  profile: {
    title: string;
    subtitle: string;
    signOut: string;
    tabOrders: string;
    tabNotifications: string;
    tabAccount: string;
    noOrders: string;
    noOrdersDesc: string;
    orderNumber: string;
    orderDate: string;
    orderStatus: string;
    viewSlip: string;
    statusPending: string;
    statusApproved: string;
    statusRejected: string;
    notificationsTitle: string;
    noNotifications: string;
    markAllRead: string;
    accountDetails: string;
    username: string;
    name: string;
    phone: string;
    address: string;
    role: string;
    customer: string;
    administrator: string;
  };
  // Admin
  admin: {
    portalTitle: string;
    dashboard: string;
    orders: string;
    products: string;
    backToStore: string;
    signOut: string;
    totalRevenue: string;
    pendingRevenue: string;
    totalOrders: string;
    pendingVerification: string;
    recentOrders: string;
    actions: string;
    approveOrder: string;
    rejectOrder: string;
    verified: string;
    rejected: string;
    pending: string;
    slipModalTitle: string;
    confirmSlipVerification: string;
    transferSlip: string;
    noSlip: string;
    addNewProduct: string;
    productTitle: string;
    productPrice: string;
    productStock: string;
    productCondition: string;
    productDescription: string;
  };
  // Auth
  auth: {
    signInTitle: string;
    signInSubtitle: string;
    usernameLabel: string;
    passwordLabel: string;
    signInBtn: string;
    signingIn: string;
    registerTitle: string;
    registerSubtitle: string;
    registerBtn: string;
    registering: string;
    noAccount: string;
    createAccount: string;
    hasAccount: string;
    adminLoginTitle: string;
    adminLoginSubtitle: string;
  };
  // Footer
  footer: {
    rightsReserved: string;
    directKPay: string;
    localStock: string;
    themeMode: string;
  };
}

export const translations: Record<Locale, Translations> = {
  en: {
    nav: {
      brandSubtitle: "Components & Workstations",
      signIn: "Sign In",
      account: "Account",
      admin: "Admin",
      cart: "Cart",
      language: "Language",
      themeLight: "Light Mode",
      themeDark: "Dark Mode",
      unreadNotifications: "unread notifications",
    },
    home: {
      badge: "DIRECT KBZPAY HARDWARE VERIFICATION",
      title: "SYSTEM COMPONENTS & RIGS",
      description:
        "High-performance server processors, graphics cards, NVMe storage, and workstations. All orders verified manually via KBZPay screenshot upload.",
      allInventory: "All Inventory",
      newParts: "New Parts",
      secondhand: "Secondhand",
      searchPlaceholder: "Search processors, GPUs...",
      noResults: "No hardware components match your filter.",
    },
    product: {
      inStock: "in stock",
      outOfStock: "Out of stock",
      unitsInStock: "units in stock",
      conditionNew: "NEW",
      conditionSecondhand: "SECONDHAND",
      price: "Price",
      addToCart: "Add",
      added: "Added",
      backToInventory: "Back to Hardware Inventory",
      specifications: "Hardware Specifications",
      quantity: "Quantity",
      subtotal: "Subtotal",
      total: "Total",
      details: "Hardware Component Details",
    },
    cart: {
      title: "HARDWARE CART",
      emptyTitle: "Your cart is empty",
      emptySubtitle: "Browse our inventory of premium processors, graphics cards, and server rigs.",
      browseInventory: "Browse Components",
      itemCount: "item",
      itemsCount: "items",
      subtotal: "Subtotal",
      shipping: "Shipping",
      freeShipping: "Free Delivery (Yangon / Nationwide via Bus)",
      total: "Total",
      clearCart: "Clear Cart",
      proceedToCheckout: "Proceed to KBZPay Checkout",
      remove: "Remove",
    },
    checkout: {
      title: "DIRECT KBZPAY CHECKOUT",
      subtitle: "Transfer via KBZPay mobile app and upload the transaction screenshot for instant admin order verification.",
      orderSummary: "Order Summary",
      kpayInstructionsTitle: "KBZPay Payment Instructions",
      kpayInstructionsSubtitle: "Follow these steps to complete your payment before placing the order:",
      kpayStep1: "1. Open your KBZPay app on your smartphone.",
      kpayStep2: "2. Transfer the exact order total to:",
      kpayStep2Phone: "KBZPay Mobile",
      kpayStep2Name: "Account Name",
      kpayStep3: "3. Take a screenshot of the completed transfer receipt and upload it below.",
      kpayStep3Upload: "Upload KBZPay Transfer Slip",
      kpayStep3Drag: "Click to upload screenshot (JPG, PNG, WebP up to 10MB)",
      kpayStep3Formats: "Screenshot attached successfully",
      customerInfoTitle: "Customer & Delivery Information",
      customerInfoSubtitle: "Provide your delivery address and contact details for dispatch.",
      fullName: "Full Name",
      fullNamePlaceholder: "e.g. Ko Aung Ko",
      phoneNumber: "Phone Number",
      phoneNumberPlaceholder: "e.g. 09798765432",
      deliveryAddress: "Delivery Address",
      deliveryAddressPlaceholder: "Building, Street, Township, City (e.g. Kamayut, Yangon)",
      placeOrderBtn: "Submit Order with Slip",
      processingOrder: "Submitting Order...",
      fillAllFieldsError: "Please fill in all contact and shipping fields.",
      uploadSlipError: "Please upload your KBZPay payment screenshot.",
    },
    orderSuccess: {
      title: "Order Submitted Successfully!",
      subtitle: "Your payment slip has been uploaded and queued for manual verification by our hardware team.",
      orderId: "Order ID",
      statusPending: "PENDING KBZPAY VERIFICATION",
      statusPendingDesc: "Our store admin is verifying your payment slip. Once confirmed, your hardware components will be packed and dispatched.",
      shippingDetails: "Shipping Destination",
      itemsOrdered: "Items in this Order",
      totalPaid: "Total Paid",
      backToStore: "Continue Shopping",
      viewInProfile: "View Order in Profile",
      qty: "Qty",
    },
    profile: {
      title: "MY ACCOUNT",
      subtitle: "Manage your profile, track hardware orders, and view system notifications.",
      signOut: "Sign Out",
      tabOrders: "My Orders",
      tabNotifications: "Notifications",
      tabAccount: "Account Details",
      noOrders: "No orders placed yet.",
      noOrdersDesc: "Explore our hardware inventory to place your first order.",
      orderNumber: "Order",
      orderDate: "Date",
      orderStatus: "Status",
      viewSlip: "View Slip",
      statusPending: "Pending Verification",
      statusApproved: "Payment Verified",
      statusRejected: "Payment Rejected",
      notificationsTitle: "System Notifications",
      noNotifications: "No notifications yet.",
      markAllRead: "Mark all as read",
      accountDetails: "Account Details",
      username: "Username",
      name: "Full Name",
      phone: "Phone",
      address: "Address",
      role: "Account Role",
      customer: "Standard Customer",
      administrator: "Store Administrator",
    },
    admin: {
      portalTitle: "ADMIN DASHBOARD",
      dashboard: "Overview",
      orders: "Orders & Verification",
      products: "Inventory Management",
      backToStore: "Hardware Store",
      signOut: "Sign Out",
      totalRevenue: "Verified Revenue",
      pendingRevenue: "Pending Verification",
      totalOrders: "Total Orders",
      pendingVerification: "Pending Slips",
      recentOrders: "Recent Orders",
      actions: "Actions",
      approveOrder: "Approve Payment",
      rejectOrder: "Reject Order",
      verified: "VERIFIED",
      rejected: "REJECTED",
      pending: "PENDING",
      slipModalTitle: "Verify KBZPay Payment Screenshot",
      confirmSlipVerification: "Compare the transaction amount with your KBZPay balance before approving.",
      transferSlip: "Transfer Slip",
      noSlip: "No screenshot uploaded",
      addNewProduct: "Add Hardware Item",
      productTitle: "Component Title",
      productPrice: "Price (MMK)",
      productStock: "Stock Units",
      productCondition: "Condition",
      productDescription: "Specifications & Details",
    },
    auth: {
      signInTitle: "HARDWARE//CORE SIGN IN",
      signInSubtitle: "Sign in with your username and password to track orders and delivery.",
      usernameLabel: "Username",
      passwordLabel: "Password",
      signInBtn: "Sign In",
      signingIn: "Authenticating...",
      registerTitle: "CREATE CUSTOMER ACCOUNT",
      registerSubtitle: "Register to place hardware orders and access priority delivery status.",
      registerBtn: "Create Account",
      registering: "Creating account...",
      noAccount: "Don't have an account?",
      createAccount: "Create an account",
      hasAccount: "Already have an account?",
      adminLoginTitle: "ADMIN CONSOLE LOGIN",
      adminLoginSubtitle: "Secure store administration and manual KBZPay slip audit portal.",
    },
    footer: {
      rightsReserved: "HARDWARE//CORE. All rights reserved.",
      directKPay: "Direct KBZPay Verification",
      localStock: "Local Hardware Stock (Yangon)",
      themeMode: "Light & Dark Mode",
    },
  },
  my: {
    nav: {
      brandSubtitle: "ကွန်ပျူတာ ပစ္စည်းများနှင့် ဆာဗာများ",
      signIn: "အကောင့်ဝင်ရန်",
      account: "မိမိအကောင့်",
      admin: "အက်ဒမင်",
      cart: "စျေးခြင်း",
      language: "ဘာသာစကား",
      themeLight: "အလင်းစနစ်",
      themeDark: "အမှောင်စနစ်",
      unreadNotifications: "မဖတ်ရသေးသော အသိပေးချက်များ",
    },
    home: {
      badge: "KBZPAY ဖြင့် တိုက်ရိုက် ငွေလွှဲအတည်ပြုစနစ်",
      title: "ကွန်ပျူတာ ပစ္စည်းများနှင့် ဆာဗာအစိတ်အပိုင်းများ",
      description:
        "စွမ်းဆောင်ရည်မြင့် ဆာဗာပရိုဆက်ဆာများ၊ ဂရပ်ဖစ်ကတ်များ၊ မြန်နှုန်းမြင့် NVMe များ နှင့် ကွန်ပျူတာအစိတ်အပိုင်းများ။ အော်ဒါအားလုံးကို KBZPay ပြေစာစလစ်ဖြင့် အတည်ပြုပေးပါသည်။",
      allInventory: "ပစ္စည်းအားလုံး",
      newParts: "အသစ်စက်စက်",
      secondhand: "တစ်ပတ်ရစ် (အာမခံပါ)",
      searchPlaceholder: "CPU, GPU, RAM ရှာဖွေပါ...",
      noResults: "ရှာဖွေမှုနှင့် ကိုက်ညီသော ပစ္စည်းမရှိသေးပါ။",
    },
    product: {
      inStock: "ပစ္စည်းရှိသည်",
      outOfStock: "ပစ္စည်းကုန်နေသည်",
      unitsInStock: "ခု လက်ကျန်ရှိပါသည်",
      conditionNew: "အသစ်",
      conditionSecondhand: "တစ်ပတ်ရစ်",
      price: "စျေးနှုန်း",
      addToCart: "ခြင်းထဲထည့်မည်",
      added: "ထည့်ပြီးပါပြီ",
      backToInventory: "ပစ္စည်းစာရင်းသို့ ပြန်သွားမည်",
      specifications: "နည်းပညာအချက်အလက်များ",
      quantity: "အရေအတွက်",
      subtotal: "ကျသင့်ငွေ",
      total: "စုစုပေါင်း",
      details: "ပစ္စည်းအသေးစိတ် အချက်အလက်များ",
    },
    cart: {
      title: "စျေးခြင်းတောင်း",
      emptyTitle: "စျေးခြင်းတောင်းထဲတွင် ပစ္စည်းမရှိသေးပါ",
      emptySubtitle: "အရည်အသွေးမြင့် ကွန်ပျူတာနှင့် ဆာဗာအစိတ်အပိုင်းများကို စတင်ရွေးချယ်လိုက်ပါ။",
      browseInventory: "ပစ္စည်းများ ကြည့်ရှုမည်",
      itemCount: "မျိုး",
      itemsCount: "မျိုး",
      subtotal: "ပစ္စည်းကျသင့်ငွေ",
      shipping: "ပို့ဆောင်ခ",
      freeShipping: "အခမဲ့ပို့ဆောင်ပေးခြင်း (ရန်ကုန် / နယ်ကားဂိတ်)",
      total: "စုစုပေါင်းကျသင့်ငွေ",
      clearCart: "ခြင်းတောင်းရှင်းမည်",
      proceedToCheckout: "KBZPay ဖြင့် ငွေရှင်းမည်",
      remove: "ဖယ်ရှားမည်",
    },
    checkout: {
      title: "KBZPAY တိုက်ရိုက် ငွေရှင်းစနစ်",
      subtitle: "KBZPay အက်ပ်မှ ငွေလွှဲပြီး ငွေလွှဲစလစ် screenshot အား တင်ပေးပါရန်။ အက်ဒမင်မှ စစ်ဆေးအတည်ပြုပေးပါမည်။",
      orderSummary: "အော်ဒါအကျဉ်းချုပ်",
      kpayInstructionsTitle: "KBZPay ငွေပေးချေမှု လမ်းညွှန်",
      kpayInstructionsSubtitle: "အော်ဒါမတင်မီ အောက်ပါအဆင့်များအတိုင်း ငွေလွှဲပေးပါရန်:",
      kpayStep1: "၁။ သင့်ဖုန်းရှိ KBZPay Application ကို ဖွင့်ပါ။",
      kpayStep2: "၂။ အော်ဒါကျသင့်ငွေ အတိအကျကို အောက်ပါ KBZPay အကောင့်သို့ လွှဲပေးပါ:",
      kpayStep2Phone: "KBZPay ဖုန်းနံပါတ်",
      kpayStep2Name: "အကောင့်အမည်",
      kpayStep3: "၃။ ငွေလွှဲပြီးစီးသည့် ပြေစာစလစ် (Screenshot) အား အောက်တွင် တင်ပေးပါရန်။",
      kpayStep3Upload: "KBZPay ငွေလွှဲပြေစာ စလစ်တင်ရန်",
      kpayStep3Drag: "ငွေလွှဲစလစ် Screenshot ကို ဤနေရာတွင် နှိပ်၍ တင်ပါ (JPG, PNG, WebP အများဆုံး 10MB)",
      kpayStep3Formats: "ငွေလွှဲစလစ် ရွေးချယ်ပြီးပါပြီ",
      customerInfoTitle: "ပို့ဆောင်ရမည့် လိပ်စာနှင့် အချက်အလက်များ",
      customerInfoSubtitle: "ပစ္စည်းပို့ဆောင်ပေးနိုင်ရန် သင့်အချက်အလက်များကို ဖြည့်စွက်ပေးပါရန်။",
      fullName: "အမည်အပြည့်အစုံ",
      fullNamePlaceholder: "ဥပမာ - ကိုအောင်ကို",
      phoneNumber: "ဆက်သွယ်ရမည့် ဖုန်းနံပါတ်",
      phoneNumberPlaceholder: "ဥပမာ - 09798765432",
      deliveryAddress: "ပို့ဆောင်ရမည့် လိပ်စာ",
      deliveryAddressPlaceholder: "အိမ်အမှတ်၊ လမ်း၊ ရပ်ကွက်၊ မြို့နယ်၊ မြို့ (ဥပမာ - ကမာရွတ်၊ ရန်ကုန်)",
      placeOrderBtn: "ငွေလွှဲစလစ်ဖြင့် အော်ဒါတင်မည်",
      processingOrder: "အော်ဒါတင်သွင်းနေပါသည်...",
      fillAllFieldsError: "ကျေးဇူးပြု၍ အမည်၊ ဖုန်း နှင့် လိပ်စာ အပြည့်အစုံ ဖြည့်စွက်ပေးပါရန်။",
      uploadSlipError: "ကျေးဇူးပြု၍ KBZPay ငွေလွှဲစလစ်ပုံကို ထည့်သွင်းပေးပါရန်။",
    },
    orderSuccess: {
      title: "အော်ဒါ အောင်မြင်စွာ တင်ပြီးပါပြီ!",
      subtitle: "သင့် KBZPay ငွေလွှဲစလစ်ကို လက်ခံရရှိပြီး စစ်ဆေးရန် စောင့်ဆိုင်းနေပါသည် (PENDING)။",
      orderId: "အော်ဒါနံပါတ်",
      statusPending: "KBZPay ငွေလွှဲစလစ် စစ်ဆေးနေပါသည်",
      statusPendingDesc: "စတိုးဆိုင်အက်ဒမင်မှ ငွေလွှဲစလစ်ကို စစ်ဆေးအတည်ပြုပြီးပါက ကွန်ပျူတာပစ္စည်းများကို ထုပ်ပိုး၍ ပို့ဆောင်ပေးမည် ဖြစ်ပါသည်။",
      shippingDetails: "ပို့ဆောင်ရမည့်လိပ်စာ",
      itemsOrdered: "မှာယူထားသော ပစ္စည်းများ",
      totalPaid: "စုစုပေါင်း ပေးချေငွေ",
      backToStore: "စျေးဆက်ဝယ်မည်",
      viewInProfile: "မိမိအကောင့်တွင် အော်ဒါကြည့်မည်",
      qty: "အရေအတွက်",
    },
    profile: {
      title: "မိမိအကောင့်",
      subtitle: "ပရိုဖိုင်စီမံခန့်ခွဲရန်၊ အော်ဒါအခြေအနေ ကြည့်ရှုရန်နှင့် အသိပေးချက်များ ဖတ်ရှုရန်။",
      signOut: "အကောင့်ထွက်မည်",
      tabOrders: "မှာယူခဲ့သော အော်ဒါများ",
      tabNotifications: "အသိပေးချက်များ",
      tabAccount: "အကောင့်အချက်အလက်များ",
      noOrders: "မှာယူထားသော အော်ဒါမရှိသေးပါ။",
      noOrdersDesc: "ကျွန်ုပ်တို့၏ ကွန်ပျူတာပစ္စည်းများကို စတင်မှာယူနိုင်ပါသည်။",
      orderNumber: "အော်ဒါနံပါတ်",
      orderDate: "ရက်စွဲ",
      orderStatus: "အခြေအနေ",
      viewSlip: "စလစ်ကြည့်မည်",
      statusPending: "စစ်ဆေးဆဲ",
      statusApproved: "ငွေလွှဲအတည်ပြုပြီး",
      statusRejected: "ငွေလွှဲငြင်းပယ်ထားသည်",
      notificationsTitle: "စနစ်အသိပေးချက်များ",
      noNotifications: "အသိပေးချက် မရှိသေးပါ။",
      markAllRead: "အားလုံး ဖတ်ပြီးကြောင်း မှတ်သားမည်",
      accountDetails: "အကောင့် အချက်အလက်များ",
      username: "အသုံးပြုသူအမည်",
      name: "အမည်",
      phone: "ဖုန်းနံပါတ်",
      address: "လိပ်စာ",
      role: "အကောင့်အမျိုးအစား",
      customer: "ဝယ်ယူသူ မန်ဘာ",
      administrator: "စတိုးဆိုင် အက်ဒမင်",
    },
    admin: {
      portalTitle: "အက်ဒမင် စီမံခန့်ခွဲမှုစနစ်",
      dashboard: "ခြုံငုံသုံးသပ်ချက်",
      orders: "အော်ဒါများနှင့် စလစ်စစ်ဆေးခြင်း",
      products: "ပစ္စည်းလက်ကျန် စီမံခန့်ခွဲခြင်း",
      backToStore: "စတိုးဆိုင်သို့ သွားမည်",
      signOut: "အကောင့်ထွက်မည်",
      totalRevenue: "အတည်ပြုပြီး ရောင်းရငွေ",
      pendingRevenue: "စစ်ဆေးဆဲ ရောင်းရငွေ",
      totalOrders: "အော်ဒါစုစုပေါင်း",
      pendingVerification: "စစ်ဆေးရန် ကျန်သောစလစ်များ",
      recentOrders: "လတ်တလော အော်ဒါများ",
      actions: "လုပ်ဆောင်ချက်များ",
      approveOrder: "ငွေလွှဲအတည်ပြုမည်",
      rejectOrder: "အော်ဒါငြင်းပယ်မည်",
      verified: "အတည်ပြုပြီး",
      rejected: "ငြင်းပယ်ထားသည်",
      pending: "စစ်ဆေးဆဲ",
      slipModalTitle: "KBZPay ငွေလွှဲစလစ် စစ်ဆေးခြင်း",
      confirmSlipVerification: "အတည်မပြုမီ KBZPay အကောင့်ရှိ ငွေပမာဏနှင့် စလစ်ကို သေချာစွာ တိုက်ဆိုင်စစ်ဆေးပါ။",
      transferSlip: "ငွေလွှဲစလစ်ပုံ",
      noSlip: "စလစ်ပုံ မရှိပါ",
      addNewProduct: "ပစ္စည်းအသစ် ထည့်သွင်းမည်",
      productTitle: "ပစ္စည်းအမည်",
      productPrice: "စျေးနှုန်း (ကျပ်)",
      productStock: "လက်ကျန် အရေအတွက်",
      productCondition: "အခြေအနေ (အသစ် / တစ်ပတ်ရစ်)",
      productDescription: "အသေးစိတ် အချက်အလက်များ",
    },
    auth: {
      signInTitle: "HARDWARE//CORE အကောင့်ဝင်ရန်",
      signInSubtitle: "အော်ဒါများနှင့် ပို့ဆောင်မှုခြေရာခံရန် သင့်အကောင့်သို့ ဝင်ရောက်ပါ။",
      usernameLabel: "အသုံးပြုသူအမည်",
      passwordLabel: "စကားဝှက်",
      signInBtn: "အကောင့်ဝင်မည်",
      signingIn: "စစ်ဆေးနေပါသည်...",
      registerTitle: "အကောင့်အသစ် ဖွင့်မည်",
      registerSubtitle: "ကွန်ပျူတာပစ္စည်းများ အလွယ်တကူ မှာယူနိုင်ရန် အကောင့်ပြုလုပ်ပါ။",
      registerBtn: "အကောင့်ဖွင့်မည်",
      registering: "အကောင့်ပြုလုပ်နေပါသည်...",
      noAccount: "အကောင့် မရှိသေးဘူးလား?",
      createAccount: "အကောင့်အသစ် ဖွင့်ရန်",
      hasAccount: "အကောင့် ရှိပြီးသားလား?",
      adminLoginTitle: "အက်ဒမင် စနစ်သို့ ဝင်ရောက်ခြင်း",
      adminLoginSubtitle: "KBZPay စလစ်စစ်ဆေးရန်နှင့် စတိုးဆိုင် စီမံခန့်ခွဲရန်။",
    },
    footer: {
      rightsReserved: "HARDWARE//CORE. မူပိုင်ခွင့်များ ရယူထားပြီးဖြစ်သည်။",
      directKPay: "KBZPay ဖြင့် တိုက်ရိုက် စစ်ဆေးစနစ်",
      localStock: "ရန်ကုန် လက်ကျန်ပစ္စည်းစတိုး",
      themeMode: "အလင်း / အမှောင် စနစ်",
    },
  },
};
