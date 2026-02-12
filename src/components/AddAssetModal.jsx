import React, { useState } from 'react';
import { X, Tractor, Hash, Upload, Loader2, Trash2 } from 'lucide-react';

const AddAssetModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Tractor',
    serial: '',
    serviceInterval: '200',
    imageFile: null
  });
  
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  // 1. Handle File Selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { 
        alert("File is too large! Max 5MB.");
        return;
      }
      setFormData({ ...formData, imageFile: file });
      setPreview(URL.createObjectURL(file)); 
    }
  };

  // 2. Clear Image
  const clearImage = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Stop click from triggering the file input again
    setFormData({ ...formData, imageFile: null });
    setPreview(null);
  };

  // 3. Upload Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    let imageUrl = 'https://images.unsplash.com/photo-1595116701777-626d7ba85655?w=600&q=80'; // Fallback

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    // Only upload if a file was actually selected
    if (formData.imageFile) {
        if (!cloudName || !uploadPreset) {
            alert("Missing Cloudinary Configuration! check your .env file.");
            setUploading(false);
            return;
        }

        const data = new FormData();
        data.append("file", formData.imageFile);
        data.append("upload_preset", uploadPreset);

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: "POST",
                body: data
            });

            if (!res.ok) throw new Error("Upload failed");

            const file = await res.json();
            imageUrl = file.secure_url;
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload image.");
            setUploading(false);
            return;
        }
    }

    // 4. Save to App
    onSave({
      name: formData.name,
      type: formData.type,
      status: 'Healthy',
      image: imageUrl, 
      specs: { serialNumber: formData.serial },
      usage: { 
        currentHours: 0, 
        serviceInterval: parseInt(formData.serviceInterval) || 200 
      },
      assignment: { isAssigned: false },
      history: []
    });
    setUploading(false);
  };

  if (uploading) {
      // Show a dedicated loading state prevents user from clicking away
      return (
        <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50 backdrop-blur-sm">
            <Loader2 className="w-16 h-16 text-white animate-spin mb-4" />
            <p className="text-white text-xl font-bold">Uploading Asset...</p>
        </div>
      );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        
        <div className="bg-blue-600 p-6 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Tractor className="text-blue-200" /> Add New Asset
          </h2>
          <button onClick={onClose} className="text-blue-100 hover:text-white"><X size={24} /></button>
        </div>

        <div className="overflow-y-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Image Upload Area */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Machine Image</label>
                <div className="relative w-full h-48 border-2 border-gray-300 border-dashed rounded-2xl bg-gray-50 overflow-hidden group hover:bg-gray-100 transition-colors">
                    
                    {/* The Hidden Input */}
                    <input 
                        type="file" 
                        id="imageUpload"
                        accept="image/*"
                        className="hidden" 
                        onChange={handleImageChange}
                    />

                    {preview ? (
                        // Preview Mode
                        <div className="relative w-full h-full">
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            <button 
                                onClick={clearImage}
                                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-all"
                                title="Remove Image"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ) : (
                        // Upload Prompt Mode
                        <label htmlFor="imageUpload" className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                            <Upload className="w-8 h-8 mb-3 text-gray-400 group-hover:text-blue-500 transition-colors" />
                            <p className="mb-2 text-sm text-gray-500"><span className="font-bold">Click to upload</span></p>
                            <p className="text-xs text-gray-400">JPG, PNG (Max 5MB)</p>
                        </label>
                    )}
                </div>
            </div>

            {/* Form Fields */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name</label>
                <input required type="text" placeholder="e.g., John Deere 5050" 
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select className="w-full px-4 py-2 border rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option>Tractor</option>
                    <option>Harvester</option>
                    <option>Seeder</option>
                    <option>Plow</option>
                    <option>Truck</option>
                </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Interval (Hrs)</label>
                    <input type="number" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.serviceInterval} onChange={e => setFormData({...formData, serviceInterval: e.target.value})} />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                <div className="relative">
                    <Hash className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    <input required type="text" className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.serial} onChange={e => setFormData({...formData, serial: e.target.value})} />
                </div>
            </div>

            <button 
                type="submit" 
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg mt-4 flex items-center justify-center gap-2"
            >
                Save & Upload
            </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default AddAssetModal;