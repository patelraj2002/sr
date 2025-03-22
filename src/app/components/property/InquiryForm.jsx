// src/app/components/property/InquiryForm.jsx
'use client';

export default function InquiryForm({ property, onSubmit, onCancel, loading }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    onSubmit({
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      message: formData.get('message'),
      sharingOptionId: formData.get('sharingOption'),
      visitDate: formData.get('visitDate')
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
            focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
            focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="tel"
          name="phone"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
            focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      {property.type === 'PG' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sharing Option
          </label>
          <select
            name="sharingOption"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
              focus:border-primary-500 focus:ring-primary-500"
          >
            {property.sharingOptions.map(option => (
              <option key={option.id} value={option.id}>
                {option.persons}-sharing (₹{option.price}/person)
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Preferred Visit Date
        </label>
        <input
          type="date"
          name="visitDate"
          min={new Date().toISOString().split('T')[0]}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
            focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Message
        </label>
        <textarea
          name="message"
          rows="4"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
            focus:border-primary-500 focus:ring-primary-500"
        ></textarea>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700
            hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
            focus:ring-primary-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 bg-primary-600 text-white rounded-md
            hover:bg-primary-700 focus:outline-none focus:ring-2 
            focus:ring-offset-2 focus:ring-primary-500
            ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Sending...' : 'Send Inquiry'}
        </button>
      </div>
    </form>
  );
}