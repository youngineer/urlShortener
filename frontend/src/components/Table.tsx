import * as React from 'react';
import type { IUrl, IUrlEntry, IUrlMap } from '../utils/types';
import { deleteUrl, getUrlList, updateUrl, addUrl } from '../services/urlServices';
import EditUrl from './EditUrl';


export default function Table() {
    const [urlMap, setUrlMap] = React.useState<IUrlMap | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);


    const handleDelete = async(id: number): Promise<void> => {
      try {
        const reload = await deleteUrl(id);
        if(reload) window.location.reload();
      } catch (error) {
        console.error(error);
      }
    }

    const handleUpdate = async(id: number, url: IUrlEntry): Promise<void> => {
      const urlPayload: IUrl = {id: id, name: url.name, shortUrl: url.shortUrl, longUrl: url.longUrl, customUrl: url.customUrl};
      try {
        const reload = await updateUrl(urlPayload);
        if(reload) window.location.reload();
      } catch (error) {
        console.error(error);
      }
    }

    const handleAdd = async(url: IUrlEntry): Promise<void> => {
      try {
        const reload = await addUrl(url);
        if(reload) window.location.reload();
      } catch (error) {
        console.error(error);
      }
    }
    
      React.useEffect(() => {
        async function getUserUrlList(): Promise<void> {
          setLoading(true);
          try {
            const response = await getUrlList();
            setUrlMap(response);
          } catch (error) {
            console.error('Failed to load URLs:', error);
            setUrlMap(null);
          } finally {
            setLoading(false);
          }
        }
        getUserUrlList();
      }, []);

  return(
        <div>
          {/* Create New URL Button */}
          <div className="mb-4 right-0">
            <button className="btn btn-outline btn-secondary" onClick={()=>(document.getElementById('modal_new') as HTMLDialogElement)?.showModal()}>
              Create New URL
            </button>
            <dialog id="modal_new" className="modal">
              <div className="modal-box">
                <EditUrl 
                  id={0} 
                  url={{name: '', shortUrl: '', longUrl: '', customUrl: ''}} 
                  isEdit={false} 
                  onSave={(_id, url) => handleAdd(url)} 
                />
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-zebra max-w-4xl">
              {/* render header once */}
              <thead className='font-bold'>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th className="w-1/2">Long URL</th>
                  <th>Short / Custom</th>
                  <th>QR Code</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {
                  urlMap ? Array.from(urlMap.entries()).map(([id, url], index) => (
                    <tr key={id}>
                      <th>{index + 1}</th>
                      <td>{url.name}</td>
                      <td className="max-w-2xl break-words">
                        <a href={url.longUrl} className="link break-words" target="_blank" rel="noopener noreferrer">{url.longUrl}</a>
                      </td>
                      <td className="whitespace-nowrap">
                        <a href={url.shortUrl} className="link" target="_blank" rel="noopener noreferrer">{url.shortUrl}</a>
                        <button className="btn btn-square ml-2" onClick={() => navigator.clipboard.writeText(url.shortUrl)} aria-label="Copy short URL">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M4 1a1 1 0 0 0-1 1v9.5A1.5 1.5 0 0 0 4.5 13H12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H4z"/>
                            <path d="M2 3a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3z"/>
                          </svg>
                        </button>
                        <span className="mx-2 text-gray-400">|</span>
                        <a href={url.customUrl} className="link" target="_blank" rel="noopener noreferrer">{url.customUrl}</a>
                        <button className="btn btn-square ml-2" onClick={() => navigator.clipboard.writeText(url.customUrl)} aria-label="Copy custom URL">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M4 1a1 1 0 0 0-1 1v9.5A1.5 1.5 0 0 0 4.5 13H12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H4z"/>
                            <path d="M2 3a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3z"/>
                          </svg>
                        </button>
                      </td>

                      <td>
                        {url.qrCode ? (
                          <img 
                            src={`data:image/png;base64,${url.qrCode}`} 
                            alt="QR Code" 
                            className="w-2xl h-2xl object-contain"
                          />
                        ) : (
                          <span className="text-gray-400">No QR</span>
                        )}
                      </td>
                      <td>
                        {/* Open the modal using document.getElementById('ID').showModal() method */}
                          <button className="btn btn-warning" onClick={()=>(document.getElementById(`modal_${id}`) as HTMLDialogElement)?.showModal()}>Edit</button>
                          <dialog id={`modal_${id}`} className="modal">
                            <div className="modal-box">
                              <EditUrl id={id} url={url} isEdit={true} onSave={handleUpdate} />
                            </div>
                            <form method="dialog" className="modal-backdrop">
                              <button>close</button>
                            </form>
                          </dialog>
                      </td>
                      <td>
                        <button className="btn btn-soft btn-error" onClick={() => handleDelete(id)}>Delete</button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={7} className="text-center py-4">
                        {loading ? 'Loading...' : 'No URLs found'}
                      </td>
                    </tr>
                  )
                }
              </tbody>
            </table>
          </div>
        </div>
  );
}
