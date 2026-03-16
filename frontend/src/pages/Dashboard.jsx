import React,{useState,useEffect} from 'react'
import ExpensePieChart from '../components/PieChart'
import ExpenseLineChart from '../components/LineChart'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const [expenses, setExpenses] = useState([])
  const [expenseData, setExpenseData] = useState([])
  const navigate = useNavigate();

  async function getExpense(){
    try{
      const response = await axios.get('http://localhost:8000/expense',
        { withCredentials: true}
      )
      console.log("Response response: ",response);
      console.log("Expense data: ",response.data);
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

  useEffect(()=>{
    // const cookie = Cookies.get('userToken');
    // if(!cookie) navigate('/signup');
    getExpense();
  }, [])

  useEffect(()=>{
    ExpenseDataGen()
  },[expenses])

  return (
    <div className='bg-slate-800  h-screen flex p-4'>
        <div className='text-white w-full'>
            <h1 className='text-2xl mb-2'>Welcome,</h1>
            <h3>A track record of your expenses are: </h3>
            <div className='w-full grid grid-cols-2 gap-4'>
                <ExpensePieChart data={expenseData}/>
                <ExpenseLineChart data={expenseData}/>
            </div>
        </div>
    </div>
  )
}

export default Dashboard