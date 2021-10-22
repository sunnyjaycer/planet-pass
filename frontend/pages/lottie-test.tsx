import type { NextPage } from 'next'

import Layout from '../components/Layout'
import Lottie from 'lottie-react'

import visitJson from '../assets/lottie-visit-scan/visit.json'
import ships from '../assets/lottie-visit-scan/ships-lottie.json'
import scanner from '../assets/lottie-visit-scan/scanner.json'
import scanner2 from '../assets/lottie-scanner/scanner.json'

const LottieTest: NextPage = () => {
  return (
    <Layout title={'Galactic Gateway'}>
      <div>
        {/* <Lottie animationData={visitJson} loop={true} autoplay={true} /> */}
        <Lottie animationData={ships} loop={true} autoplay={true} />
        <Lottie animationData={scanner2} loop={false} autoplay={true} />
        <Lottie animationData={scanner} loop={true} autoplay={true} />
      </div>
    </Layout>
  )
}

export default LottieTest
