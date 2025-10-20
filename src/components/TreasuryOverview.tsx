export default function TreasuryOverview() {
  return (
    <section className="treasury_overview treasury_overview_sticky">
      <h3>金库概览</h3>
      <div className="treasury_balance">
        <label>主金库余额</label>
        <p className="balance_amount">500,000,000 CKB</p>
      </div>
      <button className="view_treasury_button">
        查看金库详细
      </button>
    </section>
  );
}


