import React, { useState } from 'react';
import Logo from '../../../../../resources/icon.png';

interface AppointmentData {
  title?: string;
  phoneNumber: string;
  patientName: string;
  gender: string;
  age: string;
  doctorName: string;
  specialization: string;
  doctorSchedule: string;
  appointmentDate: string;
  appointmentTime: string;
  location: string;
  status: string;
  member: boolean;
  paidAmount: string;
  discount: string;
  consultationFee: string;
  totalBill: string;
  outstandingAmount: string;
  paymentStatus: string;
  paymentMode: string;
  pin: string;
  fssai: string;
}

const EmptyAppointment: AppointmentData = {
  phoneNumber: '',
  patientName: '',
  gender: '',
  age: '',
  doctorName: '',
  specialization: '',
  doctorSchedule: '',
  appointmentDate: '',
  appointmentTime: '',
  location: '',
  status: 'Pending',
  member: false,
  paidAmount: '0',
  discount: '0',
  consultationFee: '0',
  totalBill: '0',
  outstandingAmount: '0',
  paymentStatus: 'Pending',
  paymentMode: 'Cash',
  pin: '',
  fssai: ''
};

const Section: React.FC<{ title: string; children: any }> = ({ title, children }) => (
  <div className="border border-gray-300 rounded-md p-4 shadow-sm mb-4 bg-white">
    <h2 className="text-md font-semibold mb-3">{title}</h2>
    <div className="grid grid-cols-2 gap-4">{children}</div>
  </div>
);

const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
}: any) => (
  <div>
    <label className="text-xs font-semibold">{label}</label>
    <input
      type={type}
      className="border px-2 py-1 rounded-md text-xs w-full mt-1"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const SelectField = ({
  label,
  value,
  onChange,
  options,
}: any) => (
  <div>
    <label className="text-xs font-semibold">{label}</label>
    <select
      className="border px-2 py-1 rounded-md text-xs w-full mt-1"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((op: string) => (
        <option key={op}>{op}</option>
      ))}
    </select>
  </div>
);

const AppointmentForm: React.FC<{
  appointment: AppointmentData;
  onChange: (a: AppointmentData) => void;
  onSave: () => void;
}> = ({ appointment, onChange, onSave }) => {

  const handleChange = (field: keyof AppointmentData, value: string | boolean) => {
    onChange({ ...appointment, [field]: value } as AppointmentData);
  };

  return (
    <div className="border-2 border-gray-300 rounded-lg p-6 mb-6 shadow-md bg-gray-50">

      {/* Header with Logo */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Appointment Form</h1>
        <div className="flex items-center gap-2">
          <img src={Logo} width={55} height={55} />
          <span className="font-semibold text-2xl">NEXUS</span>
        </div>
      </div>

      {/* Section 1 — Patient Details */}
      <Section title="Patient Details">
        <InputField label="Phone Number*" placeholder="+91 XXXXX XXXXX" value={appointment.phoneNumber} onChange={(v:any)=>handleChange('phoneNumber',v)} />
        <InputField label="Patient Name*" value={appointment.patientName} onChange={(v:any)=>handleChange('patientName',v)} />
        <SelectField label="Gender" value={appointment.gender} onChange={(v:any)=>handleChange('gender',v)} options={["", "Male", "Female", "Other"]} />
        <InputField label="Age" value={appointment.age} onChange={(v:any)=>handleChange('age',v)} />
        <InputField label="Location" value={appointment.location} onChange={(v:any)=>handleChange('location',v)} />
        <InputField label="PIN" value={appointment.pin} onChange={(v:any)=>handleChange('pin',v)} />

        {/* Member Radio Buttons */}
        <div>
          <p className="text-xs font-semibold">Member</p>
          <div className="flex items-center gap-4 mt-1">
            <label className="text-xs flex items-center gap-1">
              <input type="radio" checked={!appointment.member} onChange={() => handleChange("member", false)} /> Non-Member
            </label>
            <label className="text-xs flex items-center gap-1">
              <input type="radio" checked={appointment.member} onChange={() => handleChange("member", true)} /> Member
            </label>
          </div>
        </div>

        <InputField label="FSSAI" value={appointment.fssai} onChange={(v:any)=>handleChange('fssai',v)} />
      </Section>

      {/* Section 2 — Appointment Details */}
      <Section title="Appointment Details">
        <InputField label="Doctor Name*" value={appointment.doctorName} onChange={(v:any)=>handleChange('doctorName',v)} />
        <InputField label="Specialization" value={appointment.specialization} onChange={(v:any)=>handleChange('specialization',v)} />
        <InputField label="Doctor Schedule" value={appointment.doctorSchedule} onChange={(v:any)=>handleChange('doctorSchedule',v)} />
        <SelectField label="Status*" value={appointment.status} onChange={(v:any)=>handleChange('status',v)} options={["Pending", "Confirmed", "Cancelled"]} />
        <InputField label="Appointment Date" type="date" value={appointment.appointmentDate} onChange={(v:any)=>handleChange('appointmentDate',v)} />
        <InputField label="Appointment Time" type="time" value={appointment.appointmentTime} onChange={(v:any)=>handleChange('appointmentTime',v)} />
      </Section>

      {/* Section 3 — Payment Details */}
      <Section title="Payment Details">
        <InputField label="Paid Amount" value={appointment.paidAmount} onChange={(v:any)=>handleChange('paidAmount',v)} />
        <InputField label="Discount" value={appointment.discount} onChange={(v:any)=>handleChange('discount',v)} />
        <InputField label="Consultation Fee" value={appointment.consultationFee} onChange={(v:any)=>handleChange('consultationFee',v)} />
        <InputField label="Total Bill" value={appointment.totalBill} onChange={(v:any)=>handleChange('totalBill',v)} />
        <InputField label="Outstanding Amount" value={appointment.outstandingAmount} onChange={(v:any)=>handleChange('outstandingAmount',v)} />
        <SelectField label="Payment Status" value={appointment.paymentStatus} onChange={(v:any)=>handleChange('paymentStatus',v)} options={["Pending","Paid","Partially Paid"]} />
        <SelectField label="Payment Mode" value={appointment.paymentMode} onChange={(v:any)=>handleChange('paymentMode',v)} options={["Cash","Card","UPI","Online"]} />
      </Section>

      <div className="flex justify-end mt-4">
        <button
          onClick={onSave}
          className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Save Appointment
        </button>
      </div>
    </div>
  );
};

// ---------------- Main Manager --------------------

const AppointmentManager: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [searchDate, setSearchDate] = useState('');
  const [searchPatient, setSearchPatient] = useState('');
  const [searchMobile, setSearchMobile] = useState('');
  const [searchTitle, setSearchTitle] = useState('');

  const addNewAppointment = async () => {
    const id = await window.context.createInvoice();
    if (!id) return;

    const newAppointment: AppointmentData = {
      ...EmptyAppointment,
      title: id,
    };

    setAppointments((prev) => [...prev, newAppointment]);
  };

  const handleChange = (index: number, updated: AppointmentData) => {
    const list = [...appointments];
    list[index] = updated;
    setAppointments(list);
  };

  const handleSave = async (index: number) => {
    const appt = appointments[index];
    if (!appt.title) return alert("Invalid title");

    try {
      await window.context.writeInvoice(appt.title, JSON.stringify(appt, null, 2));
      alert("Appointment saved.");
      setAppointments((prev) => prev.filter((_, i) => i !== index));
    } catch (e) {
      alert("Save failed.");
    }
  };

  const getFilteredAppointments = async () => {
    try {
      const result = await window.context.getInvoices(searchDate, {
        patientName: searchPatient,
        mobile: searchMobile
      });

      const mapped = result.map((e:any) => ({ ...EmptyAppointment, ...e.data, title: e.title }));
      setAppointments(mapped);
    } catch {
      alert("Failed to fetch.");
    }
  };

  const searchByTitle = async () => {
    try {
      const appt = await window.context.readInvoice(searchTitle);
      if (!appt) return alert("Not found");
      setAppointments([{ ...EmptyAppointment, ...appt, title: appt.id || "" }]);
    } catch {
      alert("Error fetching");
    }
  };

  return (
    <div className="p-4">
      {/* Search Rows */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <input className="border p-1 rounded" placeholder="Date" value={searchDate} onChange={(e)=>setSearchDate(e.target.value)} />
        <input className="border p-1 rounded" placeholder="Patient Name" value={searchPatient} onChange={(e)=>setSearchPatient(e.target.value)} />
        <input className="border p-1 rounded" placeholder="Mobile" value={searchMobile} onChange={(e)=>setSearchMobile(e.target.value)} />
        <button onClick={getFilteredAppointments} className="bg-gray-800 text-white px-3 py-1 rounded">Get Appointments</button>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <input className="border p-1 rounded" placeholder="Appointment ID" value={searchTitle} onChange={(e)=>setSearchTitle(e.target.value)} />
        <button onClick={searchByTitle} className="bg-indigo-600 text-white px-3 py-1 rounded">Update by ID</button>
      </div>

      <button
        onClick={addNewAppointment}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-4"
      >
        + Add New Appointment
      </button>

      {appointments.map((a, i) => (
        <AppointmentForm
          key={a.title || i}
          appointment={a}
          onChange={(v) => handleChange(i, v)}
          onSave={() => handleSave(i)}
        />
      ))}
    </div>
  );
};

export default AppointmentManager;
