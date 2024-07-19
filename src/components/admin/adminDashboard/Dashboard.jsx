import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import React, { useEffect, useRef, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { getOrderByMonthYear } from '../../../lib/service/orderService';
import AdminHeader from "../adminLayout/AdminHeader";
import OrderDetailsModal from "../adminLayout/OrderDetailsModal";
import Sidebar from "../adminLayout/Sidebar";


const generatePDF = async (orders, chartData, chartRef) => {
  const doc = new jsPDF();
  const margin = 20;
  let yOffset = margin;

  // Add title - Centered
  const titleText = 'Dashboard Report';
  const titleWidth = doc.getStringUnitWidth(titleText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
  const titleX = (doc.internal.pageSize.width - titleWidth) / 2;
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text(titleText, titleX, yOffset);
  yOffset += 20;

  // Add section titles with bold and underline
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);

  // Section I: Chart
  doc.setFont('helvetica', 'bold'); // Set font to bold
  doc.textWithLink('I. Chart', margin, yOffset, { url: 'https://parall.ax/' });
  yOffset += 20;

  // Add chart section
  const chartElement = chartRef.current;
  if (chartElement) {
    try {
      const canvas = await html2canvas(chartElement); // Use html2canvas to capture chart
      const chartImage = canvas.toDataURL('image/png');
      doc.addImage(chartImage, 'PNG', margin, yOffset, 120, 45);
      yOffset += 60; // Increase yOffset after adding chart section
    } catch (error) {
      console.error('Error capturing chart:', error);
    }
  }

  // Section II: Orders Details
  doc.text('II. Orders Details', margin, yOffset, { url: 'https://parall.ax/' });
  yOffset += 20;

  // Loop through orders
  orders.forEach((order, index) => {
    if (yOffset + 300 > doc.internal.pageSize.height) {
      doc.addPage(); // Add a new page if content exceeds current page height
      yOffset = margin;
    }

    yOffset += 20; // Increase yOffset between each order

    // Order number
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0); // Black color
    doc.setFont('helvetica', 'normal'); // Reset font style
    doc.text(`${index + 1}. Order`, margin, yOffset);
    doc.textWithLink('Order', margin + doc.getStringUnitWidth(`${index + 1}. `) * doc.internal.getFontSize() / doc.internal.scaleFactor, yOffset, { url: '' });

    // Order details
    yOffset += 10;
    doc.setFontSize(12);
    doc.setTextColor(0); // Reset color to black
    doc.text(`Order Requirement: ${order.orderRequirement}`, margin, yOffset);
    yOffset += 7;
    doc.text(`Payment Method: ${order.paymentMethod}`, margin, yOffset);
    yOffset += 7;
    doc.text(`Create Date: ${order.createDate ? new Date(order.createDate).toLocaleString() : 'N/A'}`, margin, yOffset);
    yOffset += 7;
    doc.text(`Total Price: ${order.totalPrice}`, margin, yOffset);
    yOffset += 7;
    doc.text(`Status: ${order.status}`, margin, yOffset);
    yOffset += 10;

    // User Info
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60); // Slightly lighter grey
    doc.text('User Info:', margin, yOffset);
    yOffset += 7;
    doc.setFontSize(12);
    doc.text(`Name: ${order.userInfo?.userName}`, margin + 10, yOffset);
    yOffset += 5;
    doc.text(`Email: ${order.userInfo?.email}`, margin + 10, yOffset);
    yOffset += 5;
    doc.text(`Phone: ${order.userInfo?.phone}`, margin + 10, yOffset);
    yOffset += 5;
    doc.text(`Address: ${order.userInfo?.address}, ${order.userInfo?.wards}, ${order.userInfo?.province}`, margin + 10, yOffset);
    yOffset += 10;

    // Order Details table
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40); // Dark grey
    doc.text('Order Details:', margin, yOffset);
    yOffset += 7;
    const tableHeight = doc.autoTable.previous.finalY + 10;
    if (yOffset + tableHeight > doc.internal.pageSize.height) {
      doc.addPage(); // Add a new page if table exceeds current page height
      yOffset = margin;
    }
    doc.autoTable({
      startY: yOffset,
      margin: { left: margin, right: margin },
      headStyles: { fillColor: [0, 0, 128], textColor: [255, 255, 255] }, // Dark blue header with white text
      bodyStyles: { textColor: [0, 0, 0] }, // Black text
      head: [['Product', 'Quantity', 'Price', 'Color', 'Image']],
      body: order.orderDetails.map(detail => [
        detail.productName,
        detail.orderQuantity,
        detail.orderPrice,
        detail.colorName,
        { image: detail.image, width: 20, height: 20 } // Adjusted image size
      ]),
    });
    yOffset = doc.autoTable.previous.finalY + 10;
  });

  // Save the PDF
  doc.save('dashboard_report.pdf');
};



const handleExportPDF = (orders, chartData, chartRef) => {
  generatePDF(orders, chartData, chartRef);
};

const StatisticCard = ({ title, value, change }) => (
  <div className="flex flex-col justify-center items-center w-full px-4 py-6 mt-4 mb-4 text-xl font-semibold tracking-tight text-center bg-pink-300 rounded-xl shadow-lg">
  <div className="flex justify-between w-full">
    <div className="text-white">{title}</div>
    <div className={`flex items-center px-2 py-1 rounded-full ${change > 0 ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
    {change > 0 ? '⇑' : '⇓'} {Math.abs(change).toFixed(2)}%
    </div>
  </div>
  <div className="mt-4 flex items-center justify-between w-full">
  <div className="mt-3 text-4xl text-white">{value}</div>
  </div>

</div>

);

function Dashboard() {
  const currentDate = new Date();
  const [mostSoldProduct, setMostSoldProduct] = useState("");
  const [mostSoldProductQuantity, setMostSoldProductQuantity] = useState(0);
  const [totalQuantitySold, setTotalQuantitySold] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [countPreviousMonth, setCountPreviousMonth] = useState(0);
  const [totalAmountPreviousMonth, setTotalAmountPreviousMonth] = useState(0);
  const [totalPageViews, setTotalPageViews] = useState(2400); // Assuming this is a static value or obtained elsewhere
  const [updateDate, setUpdateDate] = useState("Today");
  const [selectedMonth, setSelectedMonth] = useState({ month: currentDate.getMonth() + 1, year: currentDate.getFullYear() });
  const [chartData, setChartData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orders, setOrders] = useState([]); // Add state to store orders
  const chartRef = useRef(null); // Add a ref for the chart

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }
    
      try {
        const data = await getOrderByMonthYear(selectedMonth.month, selectedMonth.year, token);
        console.log('API Response:', data); // Log API response
    
        if (data.orders && data.orders.length > 0) {
          setTotalOrders(data.count || 0);
          setTotalRevenue(data.totalAmount || 0);
          setCountPreviousMonth(data.countPreviousMonth || 0);
          setTotalAmountPreviousMonth(data.totalAmountPreviousMonth || 0);
          setTotalQuantitySold(data.quantitySold || 0);
          setMostSoldProductQuantity(data.mostSoldProductQuantity || 0);
          setMostSoldProduct(data.mostSoldProduct || "");
    
          // Process chart data
          const dailyData = data.orders.reduce((acc, order) => {
            const date = new Date(order.createDate).getDate();
            const fullDate = new Date(order.createDate).toLocaleDateString();
            const revenue = order.totalPrice;
            const existingData = acc.find(item => item.date === date);
    
            if (existingData) {
              existingData.revenue += revenue;
            } else {
              acc.push({ date, fullDate, revenue });
            }
    
            return acc;
          }, []);
    
          setChartData(dailyData);
          setOrders(data.orders); // Store the orders in the state
        } else {
          setTotalOrders(0);
          setTotalRevenue(0);
          setTotalQuantitySold(0);
          setMostSoldProductQuantity(0);
          setCountPreviousMonth(0);
          setTotalAmountPreviousMonth(0);
          setChartData([]);
          setOrders([]); // Clear orders if no data
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
        setTotalOrders(0);
        setTotalRevenue(0);
        setTotalQuantitySold(0);
        setMostSoldProductQuantity(0);
        setCountPreviousMonth(0);
        setTotalAmountPreviousMonth(0);
        setChartData([]);
        setOrders([]); // Clear orders in case of an error
      }
    };
    

    fetchData();
  }, [selectedMonth]);

  const getLast12Months = () => {
    const months = [];
    const currentDate = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      months.push({ month: date.getMonth() + 1, year: date.getFullYear() });
    }
    return months;
  };

  const handleMonthSelect = (month, year) => {
    setSelectedMonth({ month, year });
  };

  const handleDetailClick = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          padding: '10px',
        }}>
          <p>{`Date: ${payload[0].payload.fullDate}`}</p>
          <p>{`Revenue: ${payload[0].value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="h-screen bg-white-100 flex">
      <Sidebar />
      <main className="flex flex-col w-full overflow-auto">
        <header className="flex flex-col self-stretch my-auto max-md:mt-4 max-md:max-w-full">
          <AdminHeader title="DASHBOARD" />
          <section className="flex flex-col px-6 pt-6 mt-4 bg-white border-t border-solid border-gray-300 max-md:pr-5 max-md:max-w-full">
            <div className="mx-4 max-md:mr-2.5 max-md:max-w-full flex justify-between items-center">
              <h2 className="text-2xl font-bold">Overview</h2>
              <p className="text-sm">Latest update: <strong>{updateDate}</strong></p>
            </div>
            <div className="mx-4 max-md:mr-2.5 max-md:max-w-full">
              <section className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
                <StatisticCard
                  title="TOTAL ORDERS"
                  value={totalOrders}
                  change={((totalOrders - countPreviousMonth)/countPreviousMonth) * 100}
                />
                <StatisticCard
                  title="PAGE VIEW"
                  value={totalPageViews}
                  change={10}
                />
                <StatisticCard
                  title="REVENUE"
                  value={`${totalRevenue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`}
                  change={((totalRevenue - totalAmountPreviousMonth)/totalAmountPreviousMonth) * 100}
                />
              </section>
            </div>
            <section className="px-5 pt-5 pb-9 mt-5 bg-white rounded-3xl shadow-lg max-md:max-w-full">
              <div className="flex gap-5 max-md:flex-col max-md:gap-0">
                <section className="flex flex-col w-[64%] max-md:ml-0 max-md:w-full">
                  <div className="flex flex-col grow font-semibold tracking-tight text-black max-md:mt-10 max-md:max-w-full">
                    <h2 className="text-2xl max-md:max-w-full">Revenue</h2>
                    <p className="mt-6 text-base max-md:max-w-full">Overview</p>
                    <div className="flex gap-1 mt-10 max-md:flex-wrap max-md:mt-8 max-md:max-w-full">
                      <div id="chart-container" ref={chartRef} className="flex flex-auto gap-0 items-start max-md:flex-wrap max-md:max-w-full">
                        <ResponsiveContainer width="100%" height={400}>
                          <LineChart
                            data={chartData}
                            margin={{
                              top: 5, right: 30, left: 30, bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" label={{ value: 'Day', position: 'insideBottomRight', offset: -5 }} />
                            <YAxis label={{ value: 'Millions', angle: 0, position: 'outsideLeft', textAnchor: 'end', dy: -140  }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" stroke="#FF69B4" activeDot={{ r: 8 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </section>
                <section className="flex flex-col ml-5 w-[30%] max-md:ml-0 max-md:w-full">
                  <div className="flex flex-col font-semibold tracking-tight text-black max-md:mt-10">
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          className="self-end px-4 py-3.5 text-medium rounded-xl shadow-lg"
                          style={{
                            width: 150,
                            backgroundColor: "white", // Change this color to make the button more visible
                            color: "black", // Text color
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                          }}
                        >
                          {`${selectedMonth.month}/${selectedMonth.year}`}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu>
                        {getLast12Months().map(({ month, year }) => (
                          <DropdownItem key={`${month}-${year}`} onClick={() => handleMonthSelect(month, year)}>
                            {`${month}/${year}`}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
                    <div className="flex flex-col items-start px-5 pt-10 pb-5 mt-5 bg-white rounded-xl shadow-lg"
                    style={{boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'}}
                    >
                      <div className="flex items-start w-full justify-between">
                        <div className="flex flex-col">
                          <h2 className="text-lg">Best product seller this month</h2>
                          <p className="mt-3 text-xs text-gray-500">
                            {mostSoldProduct} ({mostSoldProductQuantity} products).
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start w-full justify-between mt-6">
                        <div className="flex flex-col">
                          <h2 className="text-lg">Quantity's products sold</h2>
                          <p className="mt-3 text-xs text-gray-500">
                            {totalQuantitySold}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-8">
                        <Button
                          auto
                          flat
                          className="bold-text px-4 py-2.5 text-center whitespace-nowrap rounded-xl text-white bg-pink-300 border-2 border-solid border-white"
                          onClick={handleDetailClick}
                        >
                          Details
                        </Button>
                        <Button
                          auto
                          flat
                          className="bold-text px-4 py-2.5 text-center whitespace-nowrap rounded-xl text-white bg-pink-300 border-2 border-solid border-white"
                          onClick={() => handleExportPDF(orders, chartData, chartRef)}
                        >
                          Export
                        </Button>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </section>
          </section>
        </header>
      </main>
      <OrderDetailsModal
        orders={orders}
        visible={isModalVisible}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default Dashboard;
