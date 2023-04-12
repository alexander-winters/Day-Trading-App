import React, { useState } from "react";
import BuyModal from './BuyModal'
const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const [activeButton, setActiveButton] = useState(1);
  
  const handleButtonClick = (buttonNumber) => {
    setActiveButton(buttonNumber);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);

  const handleBuyClick = (stockSymbol) => {
    setSelectedStock(stockSymbol);
    setIsModalOpen(true);
  };

  const handleSellClick = (stockSymbol) => {
    setSelectedStock(stockSymbol);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStock(null);
  };

  const [isCancelClicked, setIsCancelClicked] = useState(false);

  const handleConfirm = () => {
    // Implement your logic to handle the confirmation
    console.log('Confirm');
    handleCloseModal();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-800 w-full">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="text-white text-2xl font-bold">
                Day Trading Inc.
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <a
                    href="#"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-m font-medium"
                  >
                    Dashboard
                  </a>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="max-w-xs bg-gray-800 rounded-full flex items-center text-m text-white focus:outline-none"
                  >
                    <span className="sr-only">Open user menu</span>
                    <span>User</span>
                    <svg
                      className="h-5 w-5 ml-2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 12a2 2 0 100-4 2 2 0 000 4zm-7 2a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {isOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white text-gray-700">
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero section */}
      <div className="bg-[#0069c5] text-white font-semibold w-full pt-6 pb-6 px-4">
        <div className="text-xl mb-2">
          Account Summary:
        </div>
        <div className="w-full items-center md:gap-x-14 lg:flex grid grid-cols-2 gap-y-4 hidden">
          <div className="flex flex-col flex-wrap lg:flex-row gap-x-3">
            <span className="font-extralight text-primary-content/80">Balance:</span>
            <span className="font-semibold text-primary-content private-content">
              <span className="">$670.41</span>
            </span>
          </div>
          <div className="flex flex-col flex-wrap lg:flex-row gap-x-3">
            <span className="font-extralight text-primary-content/80"># Stocks Owned: </span>
            <span className="font-semibold text-primary-content private-content">
              <span className="">5</span>
            </span>
          </div>
          <div className="flex flex-col flex-wrap lg:flex-row gap-x-3">
            <span className="font-extralight text-primary-content/80">Stock Value:</span>
            <span className="font-semibold text-primary-content private-content">$14,700</span>
          </div>
        </div>
      </div>

      {/* Main section */}
      {/*Stocks/Buys/Sells Section */}
      <div className="bg-gray-100 py-6 px-4">
        <div className="max-w-7xl mx-auto bg-white p-6 rounded-md">
          <div className="flex mb-4">
            <button
              onClick={() => handleButtonClick(1)}
              className={`text-xl px-4 py-2 mr-2 ${
                activeButton === 1 ? 'font-bold text-black' : 'text-[#0069c5]'
              }`}
            >
              Your Stocks
            </button>
            <div className="w-[2px] bg-gray-100"></div>
            <button
              onClick={() => handleButtonClick(2)}
              className={`text-xl px-4 py-2 ml-2 mr-2 ${
                activeButton === 2 ? 'font-bold text-black' : 'text-[#0069c5]'
              }`}
            >
              Your Buys
            </button>
            <div className="w-[2px] bg-gray-100"></div>
            <button
              onClick={() => handleButtonClick(3)}
              className={`text-xl px-4 py-2 ml-2 ${
                activeButton === 3 ? 'font-bold text-black' : 'text-[#0069c5]'
              }`}
            >
              Your Sells
            </button>
          </div>
          <div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              {activeButton === 1 && (
                <tr className="text-left border-b text-m text-gray-400">
                  <th className="px-2 py-0 text-left text-sm font-medium text-gray-500 uppercase">Symbol</th>
                  <th className="px-2 py-0 text-left text-sm font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-2 py-0 text-left text-sm font-medium text-gray-500 uppercase">Value</th>
                  <th className="px-2 py-0 text-left text-sm font-medium text-gray-500 uppercase">Avg. Price</th>
                </tr>
              )}
              {activeButton === 2 && (
                <tr className="text-left border-b text-m text-gray-400">
                  <th className="px-2 py-0 text-left text-sm font-medium text-gray-500 uppercase">Symbol</th>
                  <th className="px-2 py-0 text-left text-sm font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-2 py-0 text-left text-sm font-medium text-gray-500 uppercase">Value</th>
                  <th className="px-2 py-0 text-left text-sm font-medium text-gray-500 uppercase">Last Price</th>
                  <th className="px-2 py-0 text-left text-sm font-medium text-gray-500 uppercase">Status</th>
                </tr>
              )}
              {activeButton === 3 && (
                <tr className="text-left border-b text-m text-gray-400">
                  <th className="px-2 py-0 text-left text-sm font-medium text-gray-500 uppercase">Symbol</th>
                  <th className="px-2 py-0 text-left text-sm font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-2 py-0 text-left text-sm font-medium text-gray-500 uppercase">Value</th>
                  <th className="px-2 py-0 text-left text-sm font-medium text-gray-500 uppercase">Last Price</th>
                  <th className="px-2 py-0 text-left text-sm font-medium text-gray-500 uppercase">Status</th>
                </tr>
              )}
            </thead>
            <tbody>
              {activeButton === 1 && (
                <tr className="text-l font-bold">
                  <td className="py-0.5 pr-2">S</td>
                  <td className="py-0.5 pr-2">10</td>
                  <td className="py-0.5 pr-2">$500</td>
                  <td className="py-0.5 pr-2">$50</td>
                  <td className="py-0.5 text-right">
                    <button
                      onClick={() => handleBuyClick('S')}
                      style={{
                        border: '1px solid green',
                        color: 'green',
                        borderRadius: '0.25rem',
                        padding: '0.5rem 1rem',
                        marginRight: '0.5rem',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'green';
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = 'green';
                      }}
                    >
                      BUY
                    </button>
                    <button
                      onClick={() => handleSellClick('S')}
                      style={{
                        border: '1px solid red',
                        color: 'red',
                        borderRadius: '0.25rem',
                        padding: '0.5rem 1rem',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'red';
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.color = 'red';
                      }}
                    >
                      SELL
                    </button>
                  </td>
                </tr>
              )}
              {/* Add the Modal */}
              <BuyModal isOpen={isModalOpen} onClose={handleCloseModal}>
                <h2 className="text-xl mb-4">Stock: {selectedStock}</h2>
                {/* Fetch and display the stock price */}
                <p>Stock Price: {/* Display stock price */}</p>
                <label className="block my-2">
                  Amount: $
                  <input
                    type="number"
                    min="0"
                    className="border p-2 rounded w-full"
                  />
                </label>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleCloseModal}
                    className="border-red-500 text-red-500 border px-4 py-2 mr-2 rounded hover:bg-red-500 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="border-green-500 text-green-500 border px-4 py-2 rounded hover:bg-green-500 hover:text-white"
                  >
                    Confirm
                  </button>
                </div>
              </BuyModal>
              {activeButton === 2 && (
                <tr className="text-l font-bold">
                  <td className="py-0.5 pr-2">S</td>
                  <td className="py-0.5 pr-2">10</td>
                  <td className="py-0.5 pr-2">$500</td>
                  <td className="py-0.5 pr-2">$50</td>
                  <td className="py-0.5 pr-0">Active</td>
                  <td className="py-0.5 text-right">
                    {!isCancelClicked ? (
                      <button
                        onClick={() => setIsCancelClicked(true)}
                        style={{
                          border: '1px solid orange',
                          color: 'orange',
                          borderRadius: '0.25rem',
                          padding: '0.5rem 1rem',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'orange';
                          e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = 'orange';
                        }}
                      >
                        Cancel
                      </button>
                    ) : (
                      <div>
                        <button
                          onClick={() => {
                            setIsCancelClicked(false);
                            // Add your logic to confirm the cancel action here
                          }}
                          className="pl-2 text-green-600 text-4xl font-bold mr-2"
                        >
                          &#10003;
                        </button>
                        <button
                          onClick={() => setIsCancelClicked(false)}
                          className="pl-2 text-red-600 text-4xl ont-bold"
                        >
                          &#10005;
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )}
              {activeButton === 3 && (
                <tr className="text-l font-bold">
                  <td className="py-0.5 pr-2">S</td>
                  <td className="py-0.5 pr-2">10</td>
                  <td className="py-0.5 pr-2">$500</td>
                  <td className="py-0.5 pr-2">$50</td>
                  <td className="py-0.5 pr-0">Active</td>
                  <td className="py-0.5 text-right">
                    {!isCancelClicked ? (
                      <button
                        onClick={() => setIsCancelClicked(true)}
                        style={{
                          border: '1px solid orange',
                          color: 'orange',
                          borderRadius: '0.25rem',
                          padding: '0.5rem 1rem',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'orange';
                          e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = 'orange';
                        }}
                      >
                        Cancel
                      </button>
                    ) : (
                      <div>
                        <button
                          onClick={() => {
                            setIsCancelClicked(false);
                            // Add your logic to confirm the cancel action here
                          }}
                          className="pl-2 text-green-600 text-4xl font-bold mr-2"
                        >
                          &#10003;
                        </button>
                        <button
                          onClick={() => setIsCancelClicked(false)}
                          className="pl-2 text-red-600 text-4xl font-bold"
                        >
                          &#10005;
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>

        {/* Transaction Section */}
        <div className="max-w-7xl mx-auto bg-white p-6 rounded-md mt-8">
          <h2 className="text-xl font-bold mb-4">Transactions</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-2 py-3 text-left text-sm font-medium text-gray-500 uppercase">Symbol</th>
                <th className="px-2 py-3 text-left text-sm font-medium text-gray-500 uppercase">Type</th>
                <th className="px-2 py-3 text-left text-sm font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-2 py-3 text-left text-sm font-medium text-gray-500 uppercase">Price</th>
                <th className="px-2 py-3 text-left text-sm font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-l font-bold">
                <td className="py-2.5 pr-2">AAPL</td>
                <td className="py-2.5 pr-2">Buy</td>
                <td className="py-2.5 pr-2">10</td>
                <td className="py-2.5 pr-2">$150</td>
                <td className="py-2.5 pr-2">2023-04-11</td>
              </tr>
              {/* Add more table rows with data if needed */}
            </tbody>
          </table>
        </div>
      
        {/* Stocks section */}
        <div className="max-w-7xl mx-auto bg-white p-6 rounded-md mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Available Stocks</h2>
            <input
              type="text"
              className="border-2 border-gray-300 rounded-md px-3 py-1"
              placeholder="Search Symbol"
            />
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-2 py-3 text-left text-sm font-medium text-gray-500 uppercase">Symbol</th>
                <th className="px-2 py-3 text-left text-sm font-medium text-gray-500 uppercase">Price ($)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-xl font-bold">
                <td className="py-2.5 pr-2">S</td>
                <td className="py-2.5 pr-2">54.21</td>
                <td className="py-2.5 pr-2 text-right">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded">
                    Quote
                  </button>
                </td>
              </tr>
              {/* Add more table rows with data if needed */}
            </tbody>
          </table>
        </div>

      </div>
      
    </div>
  );
};

export default Dashboard;
