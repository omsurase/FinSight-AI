import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  TrendingUp, 
  TrendingDown,
  Search,
  ThumbsUp,
  ThumbsDown,
  Minus
} from 'lucide-react';

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTicker, setCurrentTicker] = useState('AAPL');
  const [portfolioData, setPortfolioData] = useState([]);
  const [stockInfo, setStockInfo] = useState({
    symbol: '',
    name: '',
    sector: '',
    industry: '',
    price: 0,
    marketCap: 0,
    peRatio: 0,
    dividendYield: 0,
    weekHigh52: 0,
    weekLow52: 0,
    change: 0,
    changePercent: 0
  });

  const [companyInfo, setCompanyInfo] = useState({
    description: '',
    website: '',
    fullTimeEmployees: '',
    headquarters: {
      city: '',
      state: '',
      country: ''
    },
    founded: '',
    ceo: '',
    exchange: ''
  });

  const [news, setNews] = useState([]);
  const [financials, setFinancials] = useState({
    marketCap: 0,
    peRatio: 0,
    dividendYield: 0,
    predictedPrice: 185.50, // Hardcoded predicted price
    sentiment: 'neutral'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setCurrentTicker(searchTerm.toUpperCase());
      setSearchTerm('');
    }
  };


  const fetchCompanyInfo = async () => {
    try {
      const response = await fetch(`http://localhost:12000/api/v1/data/${currentTicker}/about`);
      const data = await response.json();
      setCompanyInfo(data);
    } catch (err) {
      console.error('Company Info Error:', err);
      setError('Error fetching company information');
    }
  };


  const fetchSentiment = async () => {
    try {
      const response = await fetch(`http://localhost:12000/api/v1/data/${currentTicker}/sentiment`);
      const data = await response.json();
      
      const { positive, negative, neutral } = data.sentiment_analysis;
      let overallSentiment = 'neutral';
      if (positive > negative) overallSentiment = 'positive';
      else if (negative > positive) overallSentiment = 'negative';
      
      setFinancials(prev => ({
        ...prev,
        sentiment: overallSentiment
      }));
    } catch (err) {
      console.error('Sentiment Error:', err);
      setError('Error fetching sentiment data');
    }
  };

  const fetchStockInfo = async () => {
    try {
      const response = await fetch(`http://localhost:12000/api/v1/data/${currentTicker}/info`);
      const data = await response.json();
      
      setStockInfo({
        symbol: data.symbol || 'N/A',
        name: data.name || 'N/A',
        sector: data.sector || 'N/A',
        industry: data.industry || 'N/A',
        price: parseFloat(data.current_price) || 0,
        marketCap: parseFloat(data.market_cap) || 0,
        peRatio: parseFloat(data.pe_ratio) || 0,
        dividendYield: parseFloat(data.dividend_yield) || 0,
        weekHigh52: parseFloat(data['52_week_high']) || 0,
        weekLow52: parseFloat(data['52_week_low']) || 0,
        change: 0,
        changePercent: 0
      });
    } catch (err) {
      console.error('Stock Info Error:', err);
      setError('Error fetching stock info');
    }
  };

  const fetchHistoricalData = async () => {
    try {
      const response = await fetch(`http://localhost:12000/api/v1/data/${currentTicker}/history?period=1mo&interval=1d`);
      const data = await response.json();
      
      if (data && data.data && Array.isArray(data.data)) {
        const performanceData = data.data.map(item => ({
          name: new Date(item.Date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          value: parseFloat(item.Close) || 0
        }));
        setPortfolioData(performanceData);
      }
    } catch (err) {
      console.error('Historical Data Error:', err);
      setError('Error fetching historical data');
    }
  };
  
  const fetchNews = async () => {
    try {
      const response = await fetch(`http://localhost:12000/api/v1/data/${currentTicker}/news`);
      const data = await response.json();
      
      if (data && data.articles) {
        setNews(data.articles);
      }
    } catch (err) {
      console.error('News Error:', err);
      setError('Error fetching news');
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <ThumbsUp className="text-green-500" size={16} />;
      case 'negative':
        return <ThumbsDown className="text-red-500" size={16} />;
      default:
        return <Minus className="text-gray-500" size={16} />;
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-500';
      case 'negative':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchStockInfo(),
          fetchHistoricalData(),
          fetchNews(),
          fetchSentiment(),
          fetchCompanyInfo()
        ]);
      } catch (err) {
        console.error('Data Fetch Error:', err);
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [currentTicker]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 text-white">
        <div className="bg-red-500 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 text-white">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gray-900 p-6">
    {/* Search Bar */}
    <div className="mb-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter stock symbol..."
          className="bg-gray-800 text-white px-4 py-2 rounded-lg flex-grow"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Search size={20} />
          Search
        </button>
      </form>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content Area (Chart + Key Stats) */}
      <div className="lg:col-span-2 space-y-6">
        {/* Stock Performance Chart */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl text-white font-bold">{currentTicker} Stock Performance</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={portfolioData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#333',
                  border: 'none',
                  color: 'white',
                }}
              />
              <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Key Financials Row */}
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Open</p>
            <p className="text-white font-semibold">${stockInfo.price.toFixed(2)}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Market Cap</p>
            <p className="text-white font-semibold">${(stockInfo.marketCap / 1e9).toFixed(2)}B</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm">P/E Ratio</p>
            <p className="text-white font-semibold">{stockInfo.peRatio.toFixed(2)}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm">52-wk High</p>
            <p className="text-white font-semibold">${stockInfo.weekHigh52.toFixed(2)}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm">52-wk Low</p>
            <p className="text-white font-semibold">${stockInfo.weekLow52.toFixed(2)}</p>
          </div>
        </div>

        {/* News Section */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl text-white font-bold mb-4">Latest {stockInfo.symbol} News</h2>
          {news.length > 0 ? (
            news.map((item, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-4 mb-3">
                <h3 className="text-white font-semibold">{item.title}</h3>
                <div className="flex justify-between items-center text-gray-400 text-sm mt-2">
                  <span>{item.publisher}</span>
                  <div className="flex items-center gap-2">
                    <span className={getSentimentColor(item.sentiment)}>
                      {item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)}
                    </span>
                    {getSentimentIcon(item.sentiment)}
                  </div>
                  <span>{new Date(item.published).toLocaleString()}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-400">No news available</div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Stock Overview and About Info */}
      <div className="bg-gray-800 rounded-lg p-6 space-y-6">
        {/* Stock Overview */}
        <div>
          <h2 className="text-2xl text-white font-bold mb-4">{stockInfo.symbol} Overview</h2>
          <div className="space-y-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="mb-3">
                <p className="text-white text-xl font-semibold">{stockInfo.name}</p>
                <div className="text-gray-400 text-sm">
                  <p>{stockInfo.sector} | {stockInfo.industry}</p>
                </div>
              </div>
              <div className="mb-2">
                <p className="text-white text-2xl font-bold">
                  ${typeof stockInfo.price === 'number' ? stockInfo.price.toFixed(2) : '0.00'}
                </p>
                <p
                  className={`text-sm flex items-center ${
                    stockInfo.change >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {stockInfo.change >= 0 ? '+' : ''}
                  {stockInfo.change.toFixed(2)} ({stockInfo.changePercent.toFixed(2)}%)
                  {stockInfo.change >= 0 ? (
                    <TrendingUp size={14} className="ml-1" />
                  ) : (
                    <TrendingDown size={14} className="ml-1" />
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* About Info */}
        <div>
          <h2 className="text-2xl text-white font-bold mb-4">About {stockInfo.name}</h2>
          <div className="space-y-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Description</p>
              <p className="text-white">{companyInfo.description || 'No description available.'}</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Website</p>
              <a
                href={companyInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                {companyInfo.website || 'N/A'}
              </a>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Headquarters</p>
              <p className="text-white">
                {companyInfo.headquarters.city}, {companyInfo.headquarters.state},{' '}
                {companyInfo.headquarters.country}
              </p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Founded</p>
              <p className="text-white">{companyInfo.founded || 'N/A'}</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">CEO</p>
              <p className="text-white">{companyInfo.ceo || 'N/A'}</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Exchange</p>
              <p className="text-white">{companyInfo.exchange || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

}