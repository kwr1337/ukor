
class DASHBOARD {
	private root = '/i'

	HOME = this.root

	BLACK_LIST = `${this.root}/black-list`
	COUNTERPARTIES = `counterparties`
	EMPLOYEES = `${this.root}/employees`
	MAIL = `${this.root}/mail`
	NOMENCLATURE = `${this.root}/nomenclature`
	ORDER_FEED = `${this.root}/order-feed`
	PRICING = `${this.root}/pricing`
	REPORTS = `${this.root}/reports`
	REVERS_IMPLEMENTATION = `${this.root}/reverse-implementation`
	SUMMARY = `${this.root}/summary`
	SUPPLIES = `${this.root}/supplies`

	REPORTSremainingstock = `${this.root}/reports/remaining-stock`

	REPORTSAll = `${this.root}/reports/all`
	REPORTSAllDATE = `${this.root}/reports/all-date`
	REPORTSAllCOUNT = `${this.root}/reports/all-count`

	REPORTSKorAll = `${this.root}/reports/korea-all`
	REPORTSKorAllDATE = `${this.root}/reports/korea-date`
	REPORTSKorAllCOUNT = `${this.root}/reports/korea-count`

	REPORTSChinaAll = `${this.root}/reports/china-all`
	REPORTSChinaAllDATE = `${this.root}/reports/china-date`
	REPORTSChinaAllCOUNT = `${this.root}/reports/china-count`


}

export const DASHBOARD_PAGES = new DASHBOARD()
