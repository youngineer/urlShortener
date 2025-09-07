import React, { useState, type ChangeEvent, type FormEvent } from 'react'
import type { IEditUrl, IUrl, IUrlEntry } from '../utils/types'
import { useNavigate } from 'react-router-dom';
import { addUrl, updateUrl } from '../services/urlServices';


const EditUrl: React.FC<IEditUrl> = ({ id, url, isEdit, onSave }) => {
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
              customUrl: urlUpdateForm.customUrl
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
    <form onSubmit={handleFormSubmit}>
        <label className="label m-2">Url-Name</label>
        <input type="text" name="name" className="input validator" required placeholder="Username" value={urlUpdateForm.name} onChange={handleInputChange}
            pattern="[A-Za-z][A-Za-z0-9\-]*" minLength={3} maxLength={30} title="Only letters, numbers or dash" />
            <p className="validator-hint">
            Must be 3 to 30 characters
            <br/>containing only letters, numbers or dash
        </p>

        <label className="label m-2">Original-Url</label>
        <input 
            pattern="^(https?://)?([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+)$"
            title="Must be valid URL" />
        <p className="validator-hint">Must be valid URL</p>

        <label className="label m-2">Short-Url</label>
        <input type="text" placeholder={urlUpdateForm.shortUrl} className="input" disabled />

        <label className="label m-2">Custom-Name</label>
        <label className="input">
            <span className="label m-2">https://kr.pt/</span>
            <input type="text" name="customUrl" className="input validator" required placeholder="custom-name" value={urlUpdateForm.customUrl} onChange={handleInputChange}
                pattern="[A-Za-z][A-Za-z0-9\-]*" minLength={3} maxLength={16} title="Only letters, numbers or dash" />
        </label>
        <p className="validator-hint">
            Must be 3 to 16 characters
            <br/>containing only letters, numbers or dash 
        </p>

        <button type="submit" className="btn btn-outline btn-success">Save</button>
    </form>
  )
}

export default EditUrl