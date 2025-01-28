import React, { useState, useEffect } from 'react';
import './css/overviewSection.css';
import SearchBar from './SearchBar';
import {
  FaSortUp,
  FaSortDown,
  FaSort,
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from 'react-icons/fa';
import useApi from '../../../../Hooks/useApi';

const OverviewSectionFlex = () => {
  const api = useApi();

  const [giftCards, setGiftCards] = useState([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [emailSearch, setEmailSearch] = useState('');
  const [amountSearch, setAmountSearch] = useState('');
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchGiftCards = async () => {
      try {
        console.log("Giftcards GET");
        const data = await api.get(window.baseDomain + 'api/giftcards', { noCache: true });

        if (Array.isArray(data)) {
          setGiftCards(data);
        } else {
          console.error('Expected an array of gift cards, but received:', data);
          setGiftCards([]);
        }
      } catch (error) {
        console.error('Error fetching gift cards:', error);
        setGiftCards([]); // Set to empty array on error
      }
    };
    fetchGiftCards();
  }, [api]);

  // Handle sorting
  const handleSort = (column) => {
    if (sortedColumn === column) {
      // Toggle sort direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortedColumn(column);
      setSortDirection('asc');
    }
  };

  // Sort gift cards based on sortedColumn and sortDirection
  const getSortedGiftCards = (cards) => {
    if (!Array.isArray(cards)) return [];

    if (!sortedColumn) return cards;

    return [...cards].sort((a, b) => {
      let aVal = a[sortedColumn];
      let bVal = b[sortedColumn];

      // Handle undefined values
      if (aVal === undefined || aVal === null) aVal = '';
      if (bVal === undefined || bVal === null) bVal = '';

      // Numeric comparison for specific columns
      if (sortedColumn === 'value' || sortedColumn === 'availableBalance') {
        aVal = parseFloat(aVal) || 0;
        bVal = parseFloat(bVal) || 0;
      } else if (sortedColumn === 'creationDate' || sortedColumn === 'expirationDate') {
        // Date comparison
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else {
        // String comparison
        aVal = aVal.toString().toLowerCase();
        bVal = bVal.toString().toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  // Filter gift cards based on search queries
  const getFilteredGiftCards = (cards) => {
    if (!Array.isArray(cards)) return [];

    return cards.filter((card) => {
      const firstName = card.firstName || '';
      const lastName = card.lastName || '';
      const email = card.email || '';
      const value = card.value !== undefined ? card.value.toString() : '';

      const customerName = `${firstName} ${lastName}`.toLowerCase();
      const matchesCustomer = customerName.includes(customerSearch.toLowerCase());
      const matchesEmail = email.toLowerCase().includes(emailSearch.toLowerCase());
      const matchesAmount =
        amountSearch === '' || value.includes(amountSearch);

      return matchesCustomer && matchesEmail && matchesAmount;
    });
  };

  // Get the processed gift cards
  const sortedGiftCards = getSortedGiftCards(giftCards);
  const processedGiftCards = getFilteredGiftCards(sortedGiftCards);

  // Pagination calculations
  const totalPages = Math.ceil(processedGiftCards.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGiftCards = processedGiftCards.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page navigation
  const goToFirstPage = () => setCurrentPage(1);
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToLastPage = () => setCurrentPage(totalPages);

  // Handle Export to CSV
  const handleExport = () => {
    const headers = [
      'Status',
      'Voornaam',
      'Achternaam',
      'Bedrag (€)',
      'Saldo (€)',
      'Aanmaak',
      'Verval',
      'Email'
    ];
    const rows = processedGiftCards.map((card) => {
      // Calculate expiration date by adding one year to creationDate
      let expirationDate = 'N.v.t.';
      if (card.creationDate) {
        // Parse creationDate and add one year
        const [year, month, day] = card.creationDate.split('-').map(Number);
        const creationDateObj = new Date(year, month - 1, day);
        creationDateObj.setFullYear(creationDateObj.getFullYear() + 1);
        // Format expiration date as YYYY-MM-DD
        const options = {
          timeZone: 'Europe/Amsterdam',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        };
        const formatter = new Intl.DateTimeFormat('nl-NL', options);
        const formattedExpirationDate = formatter.format(creationDateObj);
        const [expDay, expMonth, expYear] = formattedExpirationDate.split('-');
        expirationDate = `${expYear}-${expMonth}-${expDay}`;
      }

      return [
        statusMapping[card.status] || card.status,
        card.firstName || '',
        card.lastName || '',
        card.value || '',
        card.availableBalance || '',
        card.creationDate || 'N.v.t.',
        expirationDate,
        card.email || '',
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers, ...rows].map((e) => e.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'cadeaubonnen.csv');
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
  };

  // Render sort icon based on current sort state
  const renderSortIcon = (column) => {
    if (sortedColumn !== column) {
      return <FaSort />;
    }
    return sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  // Status mapping
  const statusMapping = {
    Used: 'Gebruikt',
    Unused: 'Niet Gebruikt',
    'Admin Cadeaubon': 'Admin Cadeaubon',
    // Add more mappings if necessary
  };

  return (
    <div className="overview-section">
      <h2 className="overview-section__title">Cadeaubon Lijst</h2>

      {/* Search Bars */}
      <div className="search-bars-container">
        <SearchBar
          placeholder="Zoeken op klant"
          value={customerSearch}
          onChange={(e) => setCustomerSearch(e.target.value)}
          className="search-bar"
        />
        <SearchBar
          placeholder="Zoeken op email"
          value={emailSearch}
          onChange={(e) => setEmailSearch(e.target.value)}
          className="search-bar"
        />
        <SearchBar
          placeholder="Zoeken op bedrag"
          value={amountSearch}
          onChange={(e) => setAmountSearch(e.target.value)}
          className="search-bar"
        />
      </div>

      <div className="overview-section__table-container">
        <table className="overview-section__table">
          <thead>
            <tr className="table-header-row">
              <th
                onClick={() => handleSort('status')}
                style={{ width: '15%' }}
              >
                Status {renderSortIcon('status')}
              </th>
              <th onClick={() => handleSort('firstName')}>
                Voornaam {renderSortIcon('firstName')}
              </th>
              <th onClick={() => handleSort('lastName')}>
                Achternaam {renderSortIcon('lastName')}
              </th>
              <th onClick={() => handleSort('value')}>
                Bedrag (€) {renderSortIcon('value')}
              </th>
              <th onClick={() => handleSort('availableBalance')}>
                Beschikbaar Saldo (€) {renderSortIcon('availableBalance')}
              </th>
              <th onClick={() => handleSort('creationDate')}>
                Aanmaakdatum {renderSortIcon('creationDate')}
              </th>
              <th onClick={() => handleSort('expirationDate')}>
                Vervaldatum {renderSortIcon('expirationDate')}
              </th>
              <th onClick={() => handleSort('email')}>
                E-mailadres {renderSortIcon('email')}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentGiftCards.length > 0 ? (
              currentGiftCards.map((card) => {
                // Calculate expiration date by adding one year to creationDate
                let expirationDate = 'N.v.t.';
                if (card.creationDate) {
                  // Parse creationDate and add one year
                  const [year, month, day] = card.creationDate.split('-').map(Number);
                  const creationDateObj = new Date(year, month - 1, day);
                  creationDateObj.setFullYear(creationDateObj.getFullYear() + 1);
                  // Format expiration date as YYYY-MM-DD
                  const options = {
                    timeZone: 'Europe/Amsterdam',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  };
                  const formatter = new Intl.DateTimeFormat('nl-NL', options);
                  const formattedExpirationDate = formatter.format(creationDateObj);
                  const [expDay, expMonth, expYear] = formattedExpirationDate.split('-');
                  expirationDate = `${expYear}-${expMonth}-${expDay}`;
                }

                return (
                  <tr key={card._id} className="table-body-row">
                    <td>
                      <span className="bubble-style">
                        {statusMapping[card.status] || card.status}
                      </span>
                    </td>
                    <td>{card.firstName || ''}</td>
                    <td>{card.lastName || ''}</td>
                    <td>€{parseFloat(card.value || 0).toFixed(2)}</td>
                    <td>€{parseFloat(card.availableBalance || 0).toFixed(2)}</td>
                    <td>{card.creationDate || 'N.v.t.'}</td>
                    <td>{expirationDate}</td>
                    <td>{card.email || ''}</td>
                  </tr>
                );
              })
            ) : (
              <tr className="no-data-row">
                <td colSpan="8" className="no-data">
                  Geen cadeaubonnen gevonden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="overview-section__pagination">
        <div className="pagination__info">
          Pagina {currentPage} van {totalPages}
        </div>
        <div className="pagination__controls">
          <button
            onClick={goToFirstPage}
            disabled={currentPage === 1}
            className="pagination__button"
            title="Eerste Pagina"
          >
            <FaAngleDoubleLeft />
          </button>
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="pagination__button"
            title="Vorige Pagina"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="pagination__button"
            title="Volgende Pagina"
          >
            <FaChevronRight />
          </button>
          <button
            onClick={goToLastPage}
            disabled={currentPage === totalPages}
            className="pagination__button"
            title="Laatste Pagina"
          >
            <FaAngleDoubleRight />
          </button>
        </div>
        <div className="export-button-container">
          <button
            className="button-style-3 button-export"
            onClick={handleExport}
          >
            Exporteer naar CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverviewSectionFlex;
