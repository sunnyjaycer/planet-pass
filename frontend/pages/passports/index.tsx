import type { NextPage } from 'next'
import Layout from '../../components/Layout'
import PageHeader from '../../components/PageHeader'
import CardGrid from '../../components/CardGrid'
import Card from '../../components/Card'
import fpoImg from '../../assets/fpo-img-2.png'
import ActionBar from '../../components/ActionBar'
import Button from '../../components/Button'

import ConnectButton from '../../components/ConnectButton'

const Passport: NextPage = () => {
  return (
    <Layout title={'Passports'}>
      <PageHeader title="My Passports" />
      {/* Example Connect button */}
      {/* <ConnectButton/> */}
      <ActionBar>
        <Button text="Create New Passport" icon="add" />
      </ActionBar>

      <CardGrid largeCards>
        <Card
          name="Passport Name"
          imgSrc={fpoImg}
          linkUrl="/passports/passport"
        />
        <Card
          name="Passport Name"
          imgSrc={fpoImg}
          linkUrl="/passports/passport"
        />
        <Card
          name="Passport Name"
          imgSrc={fpoImg}
          linkUrl="/passports/passport"
        />
      </CardGrid>
    </Layout>
  )
}

export default Passport
