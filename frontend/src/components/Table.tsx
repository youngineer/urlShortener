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
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-500 mr-2">Short:</span>
                            <a href={url.longUrl} className="link text-sm" target="_blank" rel="noopener noreferrer">{url.shortUrl}</a>
                            <button className="btn btn-xs btn-ghost ml-1" onClick={() => navigator.clipboard.writeText(url.shortUrl)} aria-label="Copy short URL">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                              </svg>
                            </button>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm text-gray-500 mr-2">Custom:</span>
                            <a href={url.longUrl} className="link text-sm" target="_blank" rel="noopener noreferrer">{url.customUrl}</a>
                            <button className="btn btn-xs btn-ghost ml-1" onClick={() => navigator.clipboard.writeText(url.customUrl)} aria-label="Copy custom URL">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                                <path d="M4 16c-1.1 0-2-.9-2 2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </td>
                      <td>
                        {url.qrCode ? (
                          <div className="relative group cursor-pointer inline-block tooltip tooltip-info" data-tip="Download QR Code"
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = `data:image/png;base64,${url.qrCode}`;
                                link.download = `qr-code-${url.name || 'url'}.png`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}>
                            <img
                              src={`data:image/png;base64,${url.qrCode}`}
                              alt="QR Code"
                              className="w-16 h-16 object-contain transition-opacity group-hover:opacity-75"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-20 rounded">
                              <svg className="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M13 11.15V4a1 1 0 1 0-2 0v7.15L8.78 8.374a1 1 0 1 0-1.56 1.25l4 5a1 1 0 0 0 1.56 0l4-5a1 1 0 1 0-1.56-1.25L13 11.15Z" clipRule="evenodd"/>
                                <path fillRule="evenodd" d="M9.657 15.874 7.358 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2.358l-2.3 2.874a3 3 0 0 1-4.685 0ZM17 16a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17Z" clipRule="evenodd"/>
                              </svg>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">No QR</span>
                        )}
                      </td>
                      <td>
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
