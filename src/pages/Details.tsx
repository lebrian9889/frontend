import axios from "axios";
import { useFirebase } from '../hooks';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import NFT from '../types/NFT';
import Metadata from '../types/Metadata';

function Details() {

  const [nft, setNft] = useState<NFT>();
  const [meta, setMeta] = useState<Metadata>();

  const params = useParams();
  const firebase = useFirebase();

  useEffect(() => {
    (async () => {
      const index = params.index;
      const resApi = await axios.get(`${process.env.REACT_APP_AES_RES}/lebrian9889/aeternalism/nft/nft/${index}`)
      const nft = resApi.data.nft as NFT;
      const tokenId = Number.parseInt(nft.mediaUrl.replace('https://aeternalism.com/nft/', ''));

      const db = getFirestore(firebase);
      const dbRef = collection(db, "nfts");
      const q = query(dbRef, where("id", "==", tokenId));
      const data = await getDocs(q);

      if (data.docs.length > 0) {
        const doc = data.docs[0].data();
        setMeta({
          id: doc.id as number,
          name: doc.name as string,
          description: doc.description as string,
          imageUrl: doc.imageUrl as string,
        })
      }

      setNft(nft)
    })()
  }, [firebase, params.index])

  return (
    <div className='container mx-auto px-6 md:px-12 relative z-10 flex items-center py-12 xl:py-16'>
      <div className='w-full flex flex-col items-center relative z-10'>
        <div className='container max-w-xl mx-auto shadow-md'>
          <div className="p-4 bg-gray-100 border-t-2 border-indigo-400 rounded-lg bg-opacity-5">
            <div className="mx-auto md:w-full md:mx-0">
              <div className="items-center space-x-4">
                <img src={meta?.imageUrl} alt={meta?.name} className="mx-auto object-fit h-32 w-32 " />
              </div>
            </div>
          </div>

          <div className='space-y-6 bg-white'>
            <div className='items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0'>
              <h2 className='max-w-sm mx-auto md:w-1/3'>Name</h2>
              <div className='max-w-sm mx-auto md:w-2/3'>
                <div className=' relative '>
                  <span className='block font-semibold text-sm'>{meta?.name}</span>
                </div>
              </div>
            </div>

            <hr />

            <div className='items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0'>
              <h2 className='max-w-sm mx-auto md:w-1/3'>Description</h2>
              <div className='max-w-sm mx-auto md:w-2/3'>
                <div className=' relative '>
                  <span className='block font-semibold text-sm'>{meta?.description}</span>
                </div>
              </div>
            </div>

            <hr />

            <div className='items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0'>
              <h2 className='max-w-sm mx-auto md:w-1/3'>Owner</h2>
              <div className='max-w-sm mx-auto md:w-2/3'>
                <div className=' relative '>
                  <span className='block font-semibold text-sm'>{nft?.owner}</span>
                </div>
              </div>
            </div>

            <hr />

            <div className='items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0'>
              <h2 className='max-w-sm mx-auto md:w-1/3'>Original Chain</h2>
              <div className='max-w-sm mx-auto md:w-2/3'>
                <div className=' relative '>
                  <span className='block font-semibold text-sm'>{nft?.orgChain}</span>
                </div>
              </div>
            </div>

            <hr />

            <div className='items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0'>
              <h2 className='max-w-sm mx-auto md:w-1/3'>Original Owner</h2>
              <div className='max-w-sm mx-auto md:w-2/3'>
                <div className=' relative '>
                  <span className='block font-semibold text-sm'>{nft?.orgOwner}</span>
                </div>
              </div>
            </div>

            <hr />

            <div className='items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0'>
              <h2 className='max-w-sm mx-auto md:w-1/3'>Original Address</h2>
              <div className='max-w-sm mx-auto md:w-2/3'>
                <div className=' relative '>
                  <span className='block font-semibold text-sm'>{nft?.orgAddress}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Details;
