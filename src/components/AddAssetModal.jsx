import React, { useState } from 'react';
import { X, Tractor, Hash, Upload, Loader2, Trash2, ShieldCheck } from 'lucide-react';

const AddAssetModal = ({ isOpen, onClose, onSave }) => {
  // CRITICAL FIX: Respect the isOpen prop from AssetList.jsx
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: '',
    type: 'Tractor',
    serial: '',
    serviceInterval: '200',
    imageFile: null
  });
  
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

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

  const clearImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFormData({ ...formData, imageFile: null });
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    let imageUrl = 'https://images.unsplash.com/photo-1595116701777-626d7ba85655?w=600&q=80'; 

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

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
      return (
        <div className="fixed inset-0 bg-slate-900/80 flex flex-col items-center justify-center z-[200] backdrop-blur-md animate-in fade-in duration-300">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Syncing to Cloud Registry...</p>
        </div>
      );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[150] p-4 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-sm shadow-2xl overflow-hidden flex flex-col border border-slate-100 animate-in zoom-in-95 duration-200">
        
        {/* Header - Compact */}
        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-tight">
            <Tractor size={18} className="text-blue-200" /> Registry Entry
          </h2>
          <button onClick={onClose} className="text-blue-100 hover:text-white transition-colors p-1 hover:bg-blue-500 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 custom-scrollbar">
            <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Image Upload Area - Compact */}
            <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Visual Documentation</label>
                <div className="relative w-full h-32 border-2 border-slate-100 border-dashed rounded-[1.5rem] bg-slate-50 overflow-hidden group hover:border-blue-500 transition-all">
                    <input type="file" id="imageUpload" accept="image/*" className="hidden" onChange={handleImageChange} />

                    {preview ? (
                        <div className="relative w-full h-full animate-in fade-in duration-300">
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            <button onClick={clearImage} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-xl shadow-lg hover:bg-red-600 transition-all">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ) : (
                        <label htmlFor="imageUpload" className="flex flex-col items-center justify-center w-full h-full cursor-pointer p-4 text-center">
                            <Upload className="w-6 h-6 mb-2 text-slate-300 group-hover:text-blue-500 transition-colors" />
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-tight">Drop machine photo or <span className="text-blue-600">browse</span></p>
                        </label>
                    )}
                </div>
            </div>

            {/* Asset Name */}
            <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Asset Designation</label>
                <input required type="text" placeholder="e.g., CASE IH PUMA 200" 
                    className="w-full px-4 py-2.5 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-xl outline-none font-bold text-xs text-slate-700 transition-all"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} 
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Category</label>
                    <select className="w-full px-3 py-2.5 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-xl outline-none font-bold text-xs text-slate-700 cursor-pointer"
                        value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                        <option>Tractor</option>
                        <option>Harvester</option>
                        <option>Seeder</option>
                        <option>Truck</option>
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Service (Hrs)</label>
                    <input type="number" className="w-full px-4 py-2.5 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-xl outline-none font-bold text-xs text-slate-700 transition-all"
                    value={formData.serviceInterval} onChange={e => setFormData({...formData, serviceInterval: e.target.value})} />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Serial Number</label>
                <div className="relative">
                    <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                    <input required type="text" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-xl outline-none font-bold text-xs text-slate-700 transition-all"
                    value={formData.serial} onChange={e => setFormData({...formData, serial: e.target.value})} />
                </div>
            </div>

            <div className="flex gap-2 pt-2">
                <button onClick={onClose} type="button" className="flex-1 py-3.5 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="flex-[2] py-3.5 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95 uppercase text-[10px] tracking-widest">Commit to Fleet</button>
            </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default AddAssetModal;