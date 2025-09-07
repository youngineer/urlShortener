import * as React from 'react';
import type { IUrl, IUrlEntry, IUrlMap } from '../utils/types';
import { deleteUrl, getUrlList, updateUrl } from '../services/urlServices';
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
          <div className="overflow-x-auto">
            <table className="table table-zebra max-w-4xl">
              {/* render header once */}
              <thead className='font-bold'>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Short URL</th>
                  <th>Long URL</th>
                  <th>Custom URL</th>
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
                      <td><a href={url.shortUrl} className="link" target="_blank" rel="noopener noreferrer">{url.shortUrl}</a></td>
                      <td><a href={url.longUrl} className="link" target="_blank" rel="noopener noreferrer">{url.longUrl}</a></td>
                      <td><a href={url.customUrl} className="link" target="_blank" rel="noopener noreferrer">{url.customUrl}</a></td>
                      <td>
                        {/* Open the modal using document.getElementById('ID').showModal() method */}
                          <button className="btn" onClick={()=>(document.getElementById(`modal_${id}`) as HTMLDialogElement)?.showModal()}>Edit</button>
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
