import React, { useState, type ChangeEvent, type FormEvent } from 'react'
import type { IEditUrl, IUrl, IUrlEntry } from '../utils/types'
import { useNavigate } from 'react-router-dom';
import { addUrl, updateUrl } from '../services/urlServices';
import type { JSX } from '@emotion/react/jsx-runtime';


const EditUrl: React.FC<IEditUrl> = ({ id, url, isEdit, onSave }): JSX.Element => {
    const navigate = useNavigate();

    const [urlUpdateForm, setUrlUpdateForm] = useState<IUrl>({
        id: id,
        name: url.name || "",
        shortUrl: url.shortUrl || "",
        longUrl: url.longUrl || "",
        customUrl: url.customUrl || ""
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setUrlUpdateForm((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const handleFormSubmit = async(e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        try {
          if (onSave) {
            const urlEntry: IUrlEntry = {
              name: urlUpdateForm.name,
              shortUrl: urlUpdateForm.shortUrl,
              longUrl: urlUpdateForm.longUrl,
              customUrl: urlUpdateForm.customUrl === "" ? "": "kr.pt/" + urlUpdateForm.customUrl
            };
            await onSave(id, urlEntry);
          } else {
            const response = await (isEdit ? updateUrl(urlUpdateForm) : addUrl(urlUpdateForm));
            if(response) navigate("/url/");
          }
        } catch (error: any) {
          console.error(error);
        }
      }


  return (
        <form onSubmit={handleFormSubmit} className="max-w-lg mx-auto p-4 bg-white rounded-lg shadow-md space-y-6">
            {/* Url Name */}
            <div className="flex flex-col">
                <label htmlFor="name" className="text-sm font-semibold text-gray-700">URL Name</label>
                <input 
                    type="text" 
                    name="name" 
                    className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    required 
                    placeholder="Enter URL Name" 
                    value={urlUpdateForm.name} 
                    onChange={handleInputChange}
                    pattern="[A-Za-z][A-Za-z0-9\s\-]*" 
                    minLength={3} 
                    maxLength={30} 
                    title="Only letters, numbers, or dash"
                />
                <p className="mt-1 text-xs text-gray-500">Must be 3 to 30 characters, containing only letters, numbers, or dash</p>
            </div>

            {/* Original Url */}
            <div className="flex flex-col">
                <label htmlFor="longUrl" className="text-sm font-semibold text-gray-700">Original URL</label>
                <input 
                    type="url" 
                    name="longUrl" 
                    className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    required 
                    placeholder="Enter Original URL"
                    value={urlUpdateForm.longUrl}
                    pattern="^(https?:\/\/)?([\w\d\-_]+(\.[\w\d\-_]+)+)(:\d+)?(\/[^\s]*)?(\?[^\s]*)?(#[^\s]*)?$" 
                    title="Must be a valid URL" 
                    onChange={handleInputChange}
                    disabled={isEdit}
                />
                <p className="mt-1 text-xs text-gray-500">Must be a valid URL</p>
            </div>

            {/* Short Url */}
            {
                isEdit && (
                    <div className="flex flex-col">
                        <label htmlFor="shortUrl" className="text-sm font-semibold text-gray-700">Short URL</label>
                        <input 
                            type="text" 
                            name="shortUrl" 
                            className="mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            placeholder={urlUpdateForm.shortUrl} 
                            disabled 
                        />
                    </div>
                )
            }

            {/* Custom Url */}
            <div className="flex flex-col">
                <label htmlFor="customUrl" className="text-sm font-semibold text-gray-700">Custom URL</label>
                <div className="flex items-center space-x-2">
                    <span className="text-gray-500">kr.pt/</span>
                    <input 
                        type="text" 
                        name="customUrl" 
                        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        required 
                        placeholder="custom-name"
                        value={urlUpdateForm.customUrl.substring(urlUpdateForm.customUrl.indexOf('/') + 1)} 
                        onChange={handleInputChange}
                        pattern="[A-Za-z][A-Za-z0-9\-]*" 
                        minLength={8} 
                        maxLength={16} 
                        title="Only letters, numbers, or dash"
                    />
                </div>
                <p className="mt-1 text-xs text-gray-500">Must be 8 to 16 characters, containing only letters, numbers, or dash</p>
            </div>

            {/* Submit Button */}
            <button 
                type="submit" 
                className="w-full py-3 mt-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
                Save
            </button>
        </form>
    );
}

export default EditUrl