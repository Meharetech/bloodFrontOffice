import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { BaseUrl } from '../Util/util';
import { toast } from 'react-toastify';

const Banneradd = () => {
    const [data, setdata] = useState([]);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await axios.get(`${BaseUrl}/getAllBanners`);
                setdata(response.data);
            } catch (error) {
                console.error('Error fetching banners:', error);
                toast.error('Failed to load banners');
            }
        };
        fetchBanners();
    }, []);


    return (

        <>

            {
                data && (
                    <div className="mb-1 mt-1 z-20 w-full">
                        <marquee>
                            <div className="flex gap-4">
                                {data.map((bannerItem) => (
                                    <div key={bannerItem._id} className="bg-white rounded-lg shadow flex-shrink-0">
                                        {/* <h1 className="text-3xl font-bold mb-2">{bannerItem.title}</h1> */}
                                        <img src={bannerItem.image} alt={bannerItem.description} className="w-40" />
                                        {/* <h2 className="text-2xl">{bannerItem.description}</h2> */}
                                    </div>
                                ))}
                            </div>
                        </marquee>
                    </div>
                )
            }

        </>
    )
}

export default Banneradd
