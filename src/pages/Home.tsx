import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFirebase } from '../hooks';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore"; 
import NFT from '../types/NFT';
import Metadata from '../types/Metadata';

function Home() {
  const [nfts, setNfts] = useState<NFT[]>([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_AES_RES}/lebrian9889/aeternalism/nft/nft`)
      .then((res) => {
        setNfts(res.data.nft);
      });
  }, []);

  return (
    <div className='container mx-auto px-6 md:px-12 relative z-10 flex items-center'>
      <div className='w-full flex flex-col items-center relative z-10'>
        <h1 className='font-extrabold text-7xl text-center sm:text-8xl text-white leading-tight mt-4'>
          Aeternalism
        </h1>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4'>
          {nfts.length > 0
            ? nfts.map((nft) => (
                <Card key={nft.index} index={nft.index} mediaUrl={nft.mediaUrl} />
              ))
            : null}
        </div>
      </div>
    </div>
  );
}

function Card({ index, mediaUrl }: { index: string, mediaUrl: string }) {
  const [meta, setMeta] = useState<Metadata>();
  const firebase = useFirebase();
  
  useEffect(() => {
    
    (async () => {
      const tokenId = Number.parseInt(mediaUrl.replace('https://aeternalism.com/nft/', ''));
      
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
      
    })()
  }, [mediaUrl, firebase]);

  return (
    <div className='flex flex-wrap items-center justify-center'>
      <div className='flex-shrink-0 mx-2 mb-6 relative overflow-hidden bg-yellow-500 rounded-lg max-w-xs shadow-lg'>
        <svg
          className='absolute bottom-0 left-0 mb-8'
          viewBox='0 0 375 283'
          fill='none'
        >
          <rect
            x='159.52'
            y='175'
            width='152'
            height='152'
            rx='8'
            transform='rotate(-45 159.52 175)'
            fill='#f3c06b'
          ></rect>
          <rect
            y='107.48'
            width='152'
            height='152'
            rx='8'
            transform='rotate(-45 0 107.48)'
            fill='#f3c06b'
          ></rect>
        </svg>
        <div className='relative pt-10 px-10 flex items-center justify-center'>
          <div className='block absolute w-48 h-48 bottom-0 left-0 -mb-24 ml-3'></div>
          <picture>
            <source srcSet={meta?.imageUrl} />
            <img
              className='relative w-40'
              src={meta?.imageUrl}
              alt='nft'
            />
          </picture>
        </div>
        <div className='relative text-white px-6 pb-6 mt-6'>
          <span className='block opacity-75 -mb-1'>{meta?.name}</span>
          <div className='flex justify-between'>
            <Link to={`/nft/${index}`}>
              <span className='block font-semibold text-xl'>{meta?.description}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
