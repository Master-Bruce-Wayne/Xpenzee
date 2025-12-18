import React, { useEffect, useState } from 'react'
import ExpenseTable from '../components/ExpenseTable'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie'
import ExpenseLineChart from '../components/LineChart'
import ExpensePieChart from '../components/PieChart'

const Expenses = () => {

  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([])
  const [expenseData, setExpenseData] = useState([])

  async function getExpense(){
    try{
      const response = await axios.get('http://localhost:8000/expense',
        { withCredentials: true}
      )
      // console.log("Response response: ",response);
      // console.log("Expense data: ",response.data);
      // return response.data
      setExpenses(response.data);

    } catch(err){}
  }
  const ExpenseDataGen = function(){
    expenses.reduce((acc,expense)=>{
      const category = expense.category;
      const price = expense.amount;
      let eleIndex;
      if(!acc) {
        acc.push({category: category, amount:0})
        eleIndex=0
      }
      else{
        acc.forEach((element, index)=>{
          if(element.category === category)  eleIndex=index
        })
        
        if(eleIndex==undefined){
          eleIndex=acc.length;
          acc.push({category: category, amount:0})
        }
      }
      acc[eleIndex].amount+=price;
      setExpenseData(acc)
      console.log("Expense data: ", expenseData)
      return acc;
    },[])
  }

  // issue here
  // useEffect(() => {
  //   const userToken = Cookies.get("userToken");
  //   if (!userToken) {
  //     navigate("/login");
  //   }
  // }, [navigate]);

  useEffect(() => {
    getExpense();
  }, []);

  useEffect(()=>{
    ExpenseDataGen()
  },[expenses])

  return (
    <div className='p-4 bg-slate-800 min-h-screen text-white'>
      <p className="text-xl font-semibold text-white mb-4">View All Your Expenses here:</p>
      <ExpenseTable data={expenses}/>
    </div>
  )
}

export default Expenses