import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, Phone, List, Grid3X3, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const STATUS_COLORS = {
  Scheduled: 'bg-blue-500/20 border-blue-500/40 text-blue-300',
  Confirmed: 'bg-green-500/20 border-green-500/40 text-green-300',
  Completed: 'bg-gray-500/20 border-gray-500/40 text-gray-300',
  Cancelled: 'bg-red-500/20 border-red-500/40 text-red-300',
  'No-Show': 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300',
  Pending: 'bg-purple-500/20 border-purple-500/40 text-purple-300',
};

export default function AppointmentCalendar({ appointments = [], onSelectDate, onSelectAppointment, onNewAppointment }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');
  const [selectedDate, setSelectedDate] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Previous month padding
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        date: daysInPrevMonth - i,
        month: 'prev',
        fullDate: new Date(year, month - 1, daysInPrevMonth - i),
      });
    }

    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: i,
        month: 'current',
        fullDate: new Date(year, month, i),
      });
    }

    // Next month padding
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        date: i,
        month: 'next',
        fullDate: new Date(year, month + 1, i),
      });
    }

    return days;
  }, [year, month]);

  const getAppointmentsForDate = useCallback((date) => {
    const dateStr = date.toISOString().slice(0, 10);
    return appointments.filter(apt => apt.appointment_date === dateStr);
  }, [appointments]);

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(year, month + direction, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (day) => {
    setSelectedDate(day.fullDate);
    if (onSelectDate) {
      onSelectDate(day.fullDate.toISOString().slice(0, 10));
    }
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const selectedDateAppointments = selectedDate
    ? getAppointmentsForDate(selectedDate)
    : [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-semibold text-white">
            {MONTHS[month]} {year}
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-1.5 text-sm font-medium text-[#7FD856] hover:bg-[#7FD856]/10 rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setViewMode('month')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all ${
                viewMode === 'month'
                  ? 'bg-[#7FD856] text-black font-medium'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid3X3 size={14} />
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all ${
                viewMode === 'week'
                  ? 'bg-[#7FD856] text-black font-medium'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <CalendarIcon size={14} />
              Week
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all ${
                viewMode === 'day'
                  ? 'bg-[#7FD856] text-black font-medium'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <List size={14} />
              Day
            </button>
          </div>
          <Button
            size="sm"
            onClick={() => onNewAppointment?.(selectedDate?.toISOString().slice(0, 10))}
            className="bg-[#7FD856] text-black hover:bg-[#6FC745]"
          >
            <Plus size={16} className="mr-1" />
            New
          </Button>
        </div>
      </div>

      {/* Month View */}
      {viewMode === 'month' && (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-white/10">
            {DAYS.map(day => (
              <div key={day} className="py-3 text-center text-sm font-medium text-gray-400">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => {
              const dayAppointments = getAppointmentsForDate(day.fullDate);
              const hasAppointments = dayAppointments.length > 0;

              return (
                <div
                  key={index}
                  onClick={() => handleDateClick(day)}
                  className={`min-h-[100px] border-b border-r border-white/5 p-2 cursor-pointer transition-colors ${
                    day.month !== 'current'
                      ? 'bg-black/20 text-gray-600'
                      : isToday(day.fullDate)
                      ? 'bg-[#7FD856]/10'
                      : isSelected(day.fullDate)
                      ? 'bg-white/10'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isToday(day.fullDate)
                      ? 'text-[#7FD856]'
                      : day.month !== 'current'
                      ? 'text-gray-600'
                      : 'text-white'
                  }`}>
                    {day.date}
                    {isToday(day.fullDate) && (
                      <span className="ml-1 text-xs bg-[#7FD856] text-black px-1.5 py-0.5 rounded">Today</span>
                    )}
                  </div>

                  <div className="space-y-1">
                    {dayAppointments.slice(0, 3).map((apt, i) => (
                      <div
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAppointment?.(apt);
                        }}
                        className={`text-xs p-1.5 rounded border truncate cursor-pointer hover:opacity-80 ${
                          STATUS_COLORS[apt.status] || STATUS_COLORS.Scheduled
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <Clock size={10} />
                          {apt.appointment_time?.slice(0, 5)}
                        </div>
                        <div className="truncate">{apt.patient_name}</div>
                      </div>
                    ))}
                    {dayAppointments.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{dayAppointments.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Week View */}
      {viewMode === 'week' && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => {
              const date = new Date(currentDate);
              date.setDate(date.getDate() - date.getDay() + i);
              const dayAppointments = getAppointmentsForDate(date);

              return (
                <div
                  key={i}
                  onClick={() => handleDateClick({ fullDate: date })}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isToday(date)
                      ? 'border-[#7FD856] bg-[#7FD856]/10'
                      : 'border-white/10 hover:bg-white/5'
                  }`}
                >
                  <div className="text-center mb-3">
                    <div className="text-xs text-gray-400">{DAYS[i]}</div>
                    <div className={`text-lg font-semibold ${isToday(date) ? 'text-[#7FD856]' : 'text-white'}`}>
                      {date.getDate()}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {dayAppointments.map((apt, idx) => (
                      <div
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAppointment?.(apt);
                        }}
                        className={`text-xs p-2 rounded border cursor-pointer ${
                          STATUS_COLORS[apt.status] || STATUS_COLORS.Scheduled
                        }`}
                      >
                        <div className="flex items-center gap-1 font-medium">
                          <Clock size={10} />
                          {apt.appointment_time?.slice(0, 5)}
                        </div>
                        <div className="truncate mt-0.5">{apt.patient_name}</div>
                      </div>
                    ))}
                    {dayAppointments.length === 0 && (
                      <div className="text-xs text-gray-600 text-center py-4">No appointments</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Day View */}
      {viewMode === 'day' && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-white">
              {selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'Select a date'}
            </h4>
          </div>

          <div className="space-y-2">
            {selectedDateAppointments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon size={48} className="mx-auto mb-3 opacity-30" />
                <p>No appointments for this date</p>
                <Button
                  onClick={() => onNewAppointment?.(selectedDate?.toISOString().slice(0, 10))}
                  className="mt-4 bg-[#7FD856] text-black hover:bg-[#6FC745]"
                >
                  <Plus size={16} className="mr-1" />
                  Add Appointment
                </Button>
              </div>
            ) : (
              selectedDateAppointments.map((apt, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => onSelectAppointment?.(apt)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.01] ${
                    STATUS_COLORS[apt.status] || STATUS_COLORS.Scheduled
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-black/20 rounded-lg">
                        <Clock size={14} />
                        <span className="font-medium">{apt.appointment_time?.slice(0, 5)}</span>
                      </div>
                      <div>
                        <div className="font-medium text-white">{apt.patient_name}</div>
                        <div className="flex items-center gap-2 text-sm mt-0.5">
                          <Phone size={12} />
                          {apt.patient_phone}
                        </div>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border ${
                      STATUS_COLORS[apt.status] || STATUS_COLORS.Scheduled
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                  {apt.service && (
                    <div className="mt-2 text-sm">Service: {apt.service}</div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Selected Date Summary */}
      {selectedDate && viewMode !== 'day' && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-white">
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h4>
            <span className="text-sm text-gray-400">
              {selectedDateAppointments.length} appointment{selectedDateAppointments.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {['Scheduled', 'Confirmed', 'Completed', 'Cancelled'].map(status => {
              const count = selectedDateAppointments.filter(apt => apt.status === status).length;
              return (
                <div key={status} className="text-center p-2 rounded-lg bg-white/5">
                  <div className="text-lg font-semibold text-white">{count}</div>
                  <div className="text-xs text-gray-400">{status}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
