import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const AddNew = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();

  async function onSubmit(data) {
    // console.log("Form data: ", data);
    try {
      const response = await axios.post(
        "http://localhost:8000/expense/add",
        data,
        { withCredentials: true }
      );
      // console.log("Response data: ", response.data);
      navigate("/expense");
    } catch (err) {
      console.log("Error: ", err);
      alert(err.message);
    }
  }

  return (
    <div className=" min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Add A New Expense
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          <div>
            <input
              {...register("category", { required: true })}
              type="text"
              placeholder="Category"
              className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.category && (
              <p className="text-red-400 text-sm mt-1">Category is required</p>
            )}
          </div>

          <div>
            <input
              {...register("description")}
              type="text"
              placeholder="Description"
              className="w-full p-3 bg-gray-700 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-1">
                Description is required
              </p>
            )}
          </div>

          <div>
            <input
              {...register("date", { required: true })}
              type="date"
              className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.date && (
              <p className="text-red-400 text-sm mt-1">Date is required</p>
            )}
          </div>

          <div>
            <input
              {...register("amount", { required: true })}
              type="number"
              placeholder="Amount"
              className="w-full p-3 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.amount && (
              <p className="text-red-400 text-sm mt-1">Amount is required</p>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition duration-200"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>

        <p className="text-center mt-4">
          View All Your Expenses?{" "}
          <Link to="/expense" className="text-blue-400 hover:underline">
            Visit
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AddNew;
