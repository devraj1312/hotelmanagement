const ExpenseBox = () => {
  return (
    <div className="finance-box">
      <h5><i className="bi bi-cash-coin"></i> Other Expenses</h5>
      <ul className="expense-list">
        <li><span>Electricity Bill</span><span>₹12,000</span></li>
        <li><span>Water Charges</span><span>₹2,500</span></li>
        <li><span>Cleaning Supplies</span><span>₹5,000</span></li>
      </ul>
    </div>
  );
};

export default ExpenseBox;
