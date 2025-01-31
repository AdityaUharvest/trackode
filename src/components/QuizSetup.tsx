"use client"
import React from 'react';
import ProfileLeftCard from './ProfileLeftCard';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
function TimePicker({ value, onChange, label }: any) {
  const hours = [...Array(24).keys()];
  const minutes = [...Array(60).keys()];

  const handleChange = (e: any, type: any) => {
    const newValue = { ...value, [type]: e.target.value };
    onChange(newValue);
  };

  return (
    <div className="flex  flex-col">
      <label className="text-gray-300 text-sm font-medium mb-1">{label}</label>
      <div className="flex gap-2">
        <select
          title="Hours"
          className="w-full mt-1 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={value.hours}
          onChange={(e) => handleChange(e, 'hours')}
        >
          {hours.map((hour) => (
            <option key={hour} value={hour}>
              {hour < 10 ? `0${hour}` : hour}
            </option>
          ))}
        </select>
        <span className="text-gray-300 self-center">:</span>
        <select
          title="Minutes"
          className="w-full mt-1 py-2 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={value.minutes}
          onChange={(e) => handleChange(e, 'minutes')}
        >
          {minutes.map((minute) => (
            <option key={minute} value={minute}>
              {minute < 10 ? `0${minute}` : minute}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function QuizSetup() {
  const [name, setName] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [startTime, setStartTime] = React.useState({ hours: 10, minutes: 0 });
  const [endTime, setEndTime] = React.useState({ hours: 12, minutes: 0 });
  const [totalMarks, setTotalMarks] = React.useState('');
  const [totalQuestions, setTotalQuestions] = React.useState('');
  const { data: session, status } = useSession();
  const user = session?.user?.id || " ";
  const submitHandler = async (e: any) => {
    e.preventDefault();
    if (!name || !startDate || !endDate || !totalMarks || !totalQuestions) {
      toast.error('Please fill all fields');
      return;
    }
    try {
      const res = await axios.post(
        '/api/quiz/quiz-create', 
        {
          name,
          startDate,
          endDate,
          startTime,
          endTime,
          totalMarks,
          totalQuestions,
          user,
        }
      )
      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row bg-neutral-950  min-h-screen">
      {/* Dashboard Section */}
      <div className="flex-1 lg:w-1/2 sm:w-full p-6 bg-neutral-900 rounded-lg m-2">
        <h1 className="text-2xl text-white font-bold mb-6">Quiz Details</h1>
        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1">Quiz Name</label>
            <input
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              type="text"
              name="name"
              placeholder="Enter Quiz Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">Start Date</label>
              <input
              title='Start Date'
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                type="date"
                name="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">End Date</label>
              <input
                title="End Date"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                type="date"
                name="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TimePicker
              
              label="Start Time"
              value={startTime}
              onChange={setStartTime}
            />
            <TimePicker
              label="End Time"
              value={endTime}
              onChange={setEndTime}
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1">Total Marks</label>
            <input
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              type="text"
              name="total_marks"
              placeholder="Enter Total Marks"
              value={totalMarks}
              onChange={(e) => setTotalMarks(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1">Total Questions</label>
            <input
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              type="text"
              name="total_questions"
              placeholder="Enter Total Questions"
              value={totalQuestions}
              onChange={(e) => setTotalQuestions(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            Create Quiz
          </button>
        </form>
      </div>
      <div className=" sm:w-full lg:w-1/2  p-6 bg-neutral-900 rounded-lg m-2">
        Question will be here 
      </div>
    </div>
  );
}

export default QuizSetup;