import { useMetamask, useKeplr, useFirebase } from '../hooks';
import { ethers } from "ethers";
import { AesNFT__factory as AesNFTFactory, Locker__factory as LockerFactory } from "../typechain";
import { ChangeEvent, useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc } from "firebase/firestore";

function MintNFT() {

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>();
  const [imagePreview, setImagePreview] = useState("");

  const [progress, setProgress] = useState(0);

  const mAccount = useMetamask();
  const kAccount = useKeplr();
  const firebase = useFirebase();

  const mint = async () => {
    try {
      setProgress(1);

      // call mint nft
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      // Prompt user for account connections
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const aesnft = AesNFTFactory.connect(process.env.REACT_APP_NFT_CONTRACT!, signer);
      const locker = LockerFactory.connect(process.env.REACT_APP_LOCKER_CONTRACT!, signer);

      await (await aesnft.mint(mAccount!.address)).wait();

      // stupid way to get tokenId
      const tokenId = await aesnft.getTokenId();

      // call transfer
      await (await aesnft.approve(locker.address, tokenId)).wait();
      await (await locker.lock(aesnft.address, tokenId, kAccount!.address)).wait();

      // save image to cloudstorage
      const storage = getStorage();
      const storageRef = ref(storage, image!.name);
      await uploadBytes(storageRef, image!)

      const imageUrl = await getDownloadURL(storageRef);

      // save metadata to firestore
      const db = getFirestore(firebase);
      await addDoc(collection(db, "nfts"), {
        id: tokenId.toNumber(),
        name,
        description,
        imageUrl
      });

      setProgress(2);
    } catch (e) {
      console.error(e);
      setProgress(3);
    }
  }

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files![0];
    setImage(e.target.files![0])
    setImagePreview(URL.createObjectURL(file))
  }

  const renderButton = (state: number) => {
    switch (state) {
      case 1:
        return (
          <button type="button" className="py-2 px-4 flex justify-center items-center  bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
            <svg width="20" height="20" fill="currentColor" className="mr-2 animate-spin" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
              <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z">
              </path>
            </svg>
            loading
          </button>
        );
      case 2:
        return (
          <button
            type='button'
            onClick={mint}
            className='py-2 px-4 bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg '
          >
            Done
          </button>
        );
      case 3:
        return (
          <button
            type='button'
            className='py-2 px-4 bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg '
          >
            Failed
          </button>
        );
      case 0:
      default:
        return (
          <button
            type='button'
            onClick={mint}
            className='py-2 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg '
          >
            Mint & Transfer
          </button>
        );
    }
  }

  return (
    <div className='container mx-auto px-6 md:px-12 relative z-10 flex items-center py-12 xl:py-16'>
      <div className='w-full flex flex-col items-center relative z-10'>
        <section className='h-screen bg-opacity-50'>
          <form className='container max-w-2xl mx-auto shadow-md'>
            <div className="p-4 bg-gray-100 border-t-2 border-indigo-400 rounded-lg bg-opacity-5">
              <div className="max-w-sm mx-auto md:w-full md:mx-0">
                <div className="items-center space-x-4">
                  {
                    imagePreview ? <img src={imagePreview} alt="nft" className="mx-auto object-fit h-32 w-32 " /> : null
                  }
                </div>
              </div>
            </div>
            <div className='space-y-6 bg-white'>
              <div className='items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0'>
                <h2 className='max-w-sm mx-auto md:w-1/3'>Name</h2>
                <div className='max-w-sm mx-auto md:w-2/3'>
                  <div className=' relative '>
                    <input
                      type='text'
                      id='name'
                      className=' rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
                      placeholder='Name'
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <hr />

              <div className='items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0'>
                <h2 className='max-w-sm mx-auto md:w-1/3'>Description</h2>
                <div className='max-w-sm mx-auto md:w-2/3'>
                  <div className=' relative '>
                    <textarea
                      id='description'
                      className=' rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
                      placeholder='Description'
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <hr />

              <div className='items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0'>
                <h2 className='max-w-sm mx-auto md:w-1/3'>Image</h2>
                <div className='max-w-sm mx-auto md:w-2/3'>
                  <div className=' relative '>
                    <input
                      type='file'
                      id='image'
                      className=' rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
                      accept='image/*'
                      onChange={handleFile}
                    />
                  </div>
                </div>
              </div>

              <hr />

              <div className='w-full px-4 pb-4 ml-auto text-gray-500'>
                {
                  renderButton(progress)
                }

              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default MintNFT;
