import React, { useEffect, useState } from 'react'
import type { IUrl } from '../utils/types';
import { getUrlList } from '../services/urlServices';

const UrlPage = () => {
  const [urlList, setUrlList] = useState<IUrl[] | null>(null);


  useEffect(() => {
    async function getUserUrlList(): Promise<void> {
      try {
        const response = await getUrlList();
        setUrlList(response);
      } catch (error) {
        setUrlList(null);
        window.location.reload();
      }
    }
    getUserUrlList();
  }, []);
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Job</th>
              <th>Favorite Color</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr>
              <th>1</th>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td>Blue</td>
            </tr>
            {/* row 2 */}
            <tr className="hover:bg-base-300">
              <th>2</th>
              <td>Hart Hagerty</td>
              <td>Desktop Support Technician</td>
              <td>Purple</td>
            </tr>
            {/* row 3 */}
            <tr>
              <th>3</th>
              <td>Brice Swyre</td>
              <td>Tax Accountant</td>
              <td>Red</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UrlPage