import type { NextPage } from 'next'
import Layout from '../../components/Layout'
import PageHeader from '../../components/PageHeader'
import FilterableGrid from '../../components/FilterableGrid'

import { fpoStamps } from '../../utils/fakeData'

const Passport: NextPage = () => {
  return (
    <Layout title={'Passport Name'}>
      <PageHeader title="Passport Name" />
      <FilterableGrid itemData={fpoStamps} />
    </Layout>
  )
}

export default Passport
