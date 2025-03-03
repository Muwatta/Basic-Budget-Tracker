let editIndex = -1;

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function updateUI() {
  const balanceElement = document.getElementById('balance');
  const transactionsList = document.getElementById('transactions');

  transactionsList.innerHTML = '';
  let balance = 0;

  transactions.forEach((transaction, index) => {
    const li = document.createElement('li');
    li.classList.add(transaction.category);

    li.innerHTML = `
      <span class="transaction-info">
        ${transaction.description}: ₦${transaction.amount.toFixed(2)}
      </span>
      <div class="transaction-actions">
        <button class="edit-btn" onclick="editTransaction(${index})">Edit</button>
        <button class="delete-btn" onclick="deleteTransaction(${index})">X</button>
      </div>
    `;

    transactionsList.appendChild(li);
    balance +=
      transaction.category === 'income'
        ? transaction.amount
        : -transaction.amount;
  });

  balanceElement.innerText = `₦${balance.toFixed(2)}`;
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function addTransaction() {
  const descriptionInput = document.getElementById('description');
  const amountInput = document.getElementById('amount');
  const category = document.getElementById('category').value;

  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);

  if (!description || isNaN(amount) || amount <= 0) {
    alert('Please enter a valid description and amount.');
    return;
  }

 if (editIndex === -1) {
    transactions.push({ description, amount, category });
  } else {
    transactions[editIndex] = { description, amount, category };
    editIndex = -1;
    document.getElementById('add-transaction').innerText = 'Add Transaction';
  }

  updateUI();

  descriptionInput.value = '';
  amountInput.value = '';
}

function deleteTransaction(index) {
  transactions.splice(index, 1);
  updateUI();
}

function editTransaction(index) {
  const transaction = transactions[index];
  document.getElementById('description').value = transaction.description;
  document.getElementById('amount').value = transaction.amount;
  document.getElementById('category').value = transaction.category;

  editIndex = index;
  document.getElementById('add-transaction').innerText = 'Update Transaction';
}

document.getElementById('export-csv').addEventListener('click', function () {
  let csvContent = 'data:text/csv;charset=utf-8,Description,Amount,Category\n';
  transactions.forEach(transaction => {
    csvContent += `${transaction.description},${transaction.amount},${transaction.category}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'budget_transactions.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

document.addEventListener('DOMContentLoaded', function () {
  const toggleBtn = document.getElementById('toggle-theme');

  if (localStorage.getItem('dark-mode') === 'enabled') {
    document.body.classList.add('dark-mode');
  }

  toggleBtn.addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem(
      'dark-mode',
      document.body.classList.contains('dark-mode') ? 'enabled' : 'disabled'
    );
  });

  document
    .getElementById('add-transaction')
    .addEventListener('click', addTransaction);

  updateUI();
});
