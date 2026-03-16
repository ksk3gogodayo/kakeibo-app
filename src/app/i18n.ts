export type Lang = 'ja' | 'en' | 'fil';

export interface Translations {
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
}

export const translations: Record<Lang, Translations> = {
  ja: {
    appTitle: '家計簿',
    loading: '読み込み中...',
    logout: 'ログアウト',
    // タブ
    tabRecord: '記録',
    tabSummary: '集計',
    tabSettings: '設定',
    // フォーム
    registerExpense: '支出を登録',
    editExpense: '支出を編集',
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
    expenseList: '支出一覧',
    edit: '編集',
    delete: '削除',
    csvExport: 'CSVエクスポート',
    noRecords: 'まだ記録がありません',
    // アラート
    msgSaved: '保存しました！',
    msgUpdated: '更新しました！',
    msgConfirmDelete: '削除しますか？',
    // 集計
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
  },

  en: {
    appTitle: 'Kakeibo',
    loading: 'Loading...',
    logout: 'Logout',
    // tabs
    tabRecord: 'Record',
    tabSummary: 'Summary',
    tabSettings: 'Settings',
    // form
    registerExpense: 'Add Expense',
    editExpense: 'Edit Expense',
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
    expenseList: 'Expense List',
    edit: 'Edit',
    delete: 'Delete',
    csvExport: 'Export CSV',
    noRecords: 'No records yet',
    // alerts
    msgSaved: 'Saved!',
    msgUpdated: 'Updated!',
    msgConfirmDelete: 'Are you sure you want to delete?',
    // summary
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
  },

  fil: {
    appTitle: 'Talaan ng Gastos',
    loading: 'Naglo-load...',
    logout: 'Mag-logout',
    // tabs
    tabRecord: 'Talaan',
    tabSummary: 'Buod',
    tabSettings: 'Mga Setting',
    // form
    registerExpense: 'Magdagdag ng Gastos',
    editExpense: 'I-edit ang Gastos',
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
    expenseList: 'Listahan ng Gastos',
    edit: 'I-edit',
    delete: 'Tanggalin',
    csvExport: 'I-export ang CSV',
    noRecords: 'Wala pang talaan',
    // alerts
    msgSaved: 'Nai-save na!',
    msgUpdated: 'Na-update na!',
    msgConfirmDelete: 'Sigurado ka bang tanggalin ito?',
    // summary
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
  },
};
