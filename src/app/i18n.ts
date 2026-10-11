export type Lang = 'ja' | 'en' | 'fil';

export interface Translations {
  sortBy: string;
  dateNewest: string;
  dateOldest: string;
  amountHighest: string;
  amountLowest: string;
  incomeHighest: string;
  incomeLowest: string;
  expenseHighest: string;
  expenseLowest: string;
  balanceHighest: string;
  balanceLowest: string;
  appTitle: string;
  loading: string;
  logout: string;
  tabRecord: string;
  tabSummary: string;
  tabSettings: string;
  registerExpense: string;
  editExpense: string;
  itemName: string;
  itemNamePlaceholder: string;
  amount: string;
  category: string;
  paymentMethod: string;
  billingMethod: string;
  date: string;
  save: string;
  update: string;
  cancel: string;
  expenseList: string;
  edit: string;
  delete: string;
  csvExport: string;
  noRecords: string;
  msgSaved: string;
  msgUpdated: string;
  msgConfirmDelete: string;
  transactionType: string;
  monthly: string;
  daily: string;
  income: string;
  expense: string;
  balance: string;
  monthlySummary: string;
  masterDataSettings: string;
  categories: string;
  paymentMethods: string;
  billingMethods: string;
  add: string;
  newCategory: string;
  newPaymentMethod: string;
  newBillingMethod: string;
  msgAtLeastOne: string;
  billingBreakdown: string;
  total: string;
}

export const translations: Record<Lang, Translations> = {
  ja: {
    sortBy: '並び替え',
    dateNewest: '日付：新しい順',
    dateOldest: '日付：古い順',
    amountHighest: '金額：多い順',
    amountLowest: '金額：少ない順',
    incomeHighest: '収入：多い順',
    incomeLowest: '収入：少ない順',
    expenseHighest: '支出：多い順',
    expenseLowest: '支出：少ない順',
    balanceHighest: '差額：大きい順',
    balanceLowest: '差額：小さい順',

    appTitle: '家計簿',
    loading: '読み込み中...',
    logout: 'ログアウト',
    // タブ
    tabRecord: '記録',
    tabSummary: '集計',
    tabSettings: '設定',
    // フォーム
    registerExpense: '取引を登録',
    editExpense: '取引を編集',
    itemName: '品名',
    itemNamePlaceholder: '例：スーパーで買い物',
    amount: '金額',
    category: 'カテゴリ',
    paymentMethod: '決済方法',
    billingMethod: '引き落とし方法',
    date: '日付',
    save: '保存',
    update: '更新',
    cancel: 'キャンセル',
    // 一覧
    expenseList: '取引一覧',
    edit: '編集',
    delete: '削除',
    csvExport: 'CSVエクスポート',
    noRecords: 'まだ記録がありません',
    // アラート
    msgSaved: '保存しました！',
    msgUpdated: '更新しました！',
    msgConfirmDelete: '削除しますか？',
    // 集計
    transactionType: '収支区分',
    monthly: '月別',
    daily: '日別',
    income: '収入',
    expense: '支出',
    balance: '差額',
    monthlySummary: '今月の支出（カテゴリ別）',
    // 設定
    masterDataSettings: 'マスターデータ設定',
    categories: 'カテゴリ',
    paymentMethods: '決済方法',
    billingMethods: '引き落とし方法',
    add: '追加',
    newCategory: '新しいカテゴリ',
    newPaymentMethod: '新しい決済方法',
    newBillingMethod: '新しい引き落とし方法',
    msgAtLeastOne: '最低1つは必要です',
    billingBreakdown: '引き落とし方法別',
    total: '合計',
  },

  en: {
    sortBy: 'Sort by',
    dateNewest: 'Date: newest first',
    dateOldest: 'Date: oldest first',
    amountHighest: 'Amount: highest first',
    amountLowest: 'Amount: lowest first',
    incomeHighest: 'Income: highest first',
    incomeLowest: 'Income: lowest first',
    expenseHighest: 'Expense: highest first',
    expenseLowest: 'Expense: lowest first',
    balanceHighest: 'Balance: highest first',
    balanceLowest: 'Balance: lowest first',

    appTitle: 'Kakeibo',
    loading: 'Loading...',
    logout: 'Logout',
    // tabs
    tabRecord: 'Record',
    tabSummary: 'Summary',
    tabSettings: 'Settings',
    // form
    registerExpense: 'Add Transaction',
    editExpense: 'Edit Transaction',
    itemName: 'Item',
    itemNamePlaceholder: 'e.g. Grocery shopping',
    amount: 'Amount',
    category: 'Category',
    paymentMethod: 'Payment Method',
    billingMethod: 'Billing Method',
    date: 'Date',
    save: 'Save',
    update: 'Update',
    cancel: 'Cancel',
    // list
    expenseList: 'Transaction List',
    edit: 'Edit',
    delete: 'Delete',
    csvExport: 'Export CSV',
    noRecords: 'No records yet',
    // alerts
    msgSaved: 'Saved!',
    msgUpdated: 'Updated!',
    msgConfirmDelete: 'Are you sure you want to delete?',
    // summary
    transactionType: 'Transaction type',
    monthly: 'Monthly',
    daily: 'Daily',
    income: 'Income',
    expense: 'Expense',
    balance: 'Balance',
    monthlySummary: 'This Month (by Category)',
    // settings
    masterDataSettings: 'Master Data Settings',
    categories: 'Categories',
    paymentMethods: 'Payment Methods',
    billingMethods: 'Billing Methods',
    add: 'Add',
    newCategory: 'New category',
    newPaymentMethod: 'New payment method',
    newBillingMethod: 'New billing method',
    msgAtLeastOne: 'At least one item is required',
    billingBreakdown: 'By Billing Method',
    total: 'Total',
  },

  fil: {
    sortBy: 'Pagkakasunod-sunod',
    dateNewest: 'Petsa: pinakabago muna',
    dateOldest: 'Petsa: pinakaluma muna',
    amountHighest: 'Halaga: pinakamataas muna',
    amountLowest: 'Halaga: pinakamababa muna',
    incomeHighest: 'Kita: pinakamataas muna',
    incomeLowest: 'Kita: pinakamababa muna',
    expenseHighest: 'Gastos: pinakamataas muna',
    expenseLowest: 'Gastos: pinakamababa muna',
    balanceHighest: 'Balanse: pinakamataas muna',
    balanceLowest: 'Balanse: pinakamababa muna',

    appTitle: 'Talaan ng Gastos',
    loading: 'Naglo-load...',
    logout: 'Mag-logout',
    // tabs
    tabRecord: 'Talaan',
    tabSummary: 'Buod',
    tabSettings: 'Mga Setting',
    // form
    registerExpense: 'Magdagdag ng Transaksyon',
    editExpense: 'I-edit ang Transaksyon',
    itemName: 'Pangalan ng Item',
    itemNamePlaceholder: 'hal. Pamimili sa supermarket',
    amount: 'Halaga',
    category: 'Kategorya',
    paymentMethod: 'Paraan ng Bayad',
    billingMethod: 'Paraan ng Singil',
    date: 'Petsa',
    save: 'I-save',
    update: 'I-update',
    cancel: 'Kanselahin',
    // list
    expenseList: 'Listahan ng Transaksyon',
    edit: 'I-edit',
    delete: 'Tanggalin',
    csvExport: 'I-export ang CSV',
    noRecords: 'Wala pang talaan',
    // alerts
    msgSaved: 'Nai-save na!',
    msgUpdated: 'Na-update na!',
    msgConfirmDelete: 'Sigurado ka bang tanggalin ito?',
    // summary
    transactionType: 'Uri ng transaksyon',
    monthly: 'Buwanan',
    daily: 'Araw-araw',
    income: 'Kita',
    expense: 'Gastos',
    balance: 'Balanse',
    monthlySummary: 'Gastos ngayong buwan (ayon sa kategorya)',
    // settings
    masterDataSettings: 'Mga Master Data Setting',
    categories: 'Mga Kategorya',
    paymentMethods: 'Mga Paraan ng Bayad',
    billingMethods: 'Mga Paraan ng Singil',
    add: 'Idagdag',
    newCategory: 'Bagong kategorya',
    newPaymentMethod: 'Bagong paraan ng bayad',
    newBillingMethod: 'Bagong paraan ng singil',
    msgAtLeastOne: 'Kailangan ng kahit isang aytem',
    billingBreakdown: 'Ayon sa Paraan ng Singil',
    total: 'Kabuuan',
  },
};
