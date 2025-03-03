let barChart, pieChart;

document.getElementById('toggle-theme').addEventListener('click', function () {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem(
    'dark-mode',
    document.body.classList.contains('dark-mode') ? 'enabled' : 'disabled'
  );
});

function getTransactions() {
  return JSON.parse(localStorage.getItem('transactions')) || [];
}

function calculateTotals() {
  const transactions = getTransactions();
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach(transaction => {
    if (transaction.category === 'income') {
      totalIncome += transaction.amount;
    } else {
      totalExpense += transaction.amount;
    }
  });

  return { totalIncome, totalExpense };
}

function updateCharts() {
  const { totalIncome, totalExpense } = calculateTotals();

  if (barChart) barChart.destroy();
  if (pieChart) pieChart.destroy();

  barChart = new Chart(document.getElementById('barChart'), {
    type: 'bar',
    data: {
      labels: ['Income', 'Expense'],
      datasets: [
        {
          label: 'Amount (₦)',
          data: [totalIncome, totalExpense],
          backgroundColor: ['#28a745', '#dc3545'],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            font: {
              size: 14,
            },
          },
        },
      },
    },
  });

  pieChart = new Chart(document.getElementById('pieChart'), {
    type: 'pie',
    data: {
      labels: ['Income', 'Expense'],
      datasets: [
        {
          data: [totalIncome, totalExpense],
          backgroundColor: ['#28a745', '#dc3545'],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '0%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: {
              size: 18,
              weight: 'bold',
            },
            padding: 15,
          },
        },
      },
    },
  });
}

document.addEventListener('DOMContentLoaded', function () {
  updateCharts();
});
