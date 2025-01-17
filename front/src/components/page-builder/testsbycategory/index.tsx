import { useCallback, useEffect, useState, lazy } from 'react';
import { Col, Row } from 'shards-react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Meta } from 'react-head';

import { NormalizeString } from '@/helpers';
import EmptyList from '@/components/common/EmptyList';
import Loading from '@/components/common/Loading';
import { getTestsByCategory, isClient } from '@/functions';

import { MyPagination } from './components';

const AdsCard = lazy(() => import('@/components/Home/AdsCard'));
const ProductCard = lazy(() => import('@/components/Home/ProductCard'));
const BlogCard = lazy(() => import('@/components/Home/BlogCard'));
const TestCard = lazy(() => import('@/components/Home/TestCard'));

const NoOp = () => {};

export const Headers = ({ entity }) => {
  if (entity === 'item')
    return <Meta name="robots" content="noindex,nofollow" />;
};

export default function TestsByCategory(props) {
  console.log("props",props)
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [tracks, setTracks] = useState([]);
  const [counts, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  let { element = {}, params = {} } = props;
  let { settings = {} } = element;
  let { general = {} } = settings;
  let { fields = {} } = general;
  let { entity = 'test', customQuery, populateQuery,_id } = fields;

  const defaultLimit = Number(fields.limit) || 25;

  useEffect(() => {
    if (isClient) {
      loadProductItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setSearchParams, defaultLimit]);

  const limit = Number(searchParams.get('limit')) || defaultLimit;
  const offset = Number(searchParams.get('offset')) || 0;

  // const loadProductItems = useCallback(
  const loadProductItems =(filter = {}) => {
      console.group('loadProductItems',_id);

      console.log("filter",props);
      console.log("filter",filter);
      // setTracks([...[]]);
      setTracks([]);
      setLoading(true);
      const query: any = {};

      if (customQuery) {
        if (typeof customQuery == 'string') {
          customQuery = JSON.parse(customQuery);
        }
        Object.keys(customQuery).forEach((item) => {
          let main = customQuery[item];
          if (params._id) {
            let theVariable = params._id;
            const json2 = isStringified(theVariable);
            if (typeof json2 == 'object') {
              console.log('theVariable', theVariable);
            } else {
              theVariable = JSON.stringify(theVariable);
            }
            main = main.replace('"params._id"', theVariable);
            main = main.replace("'params._id'", theVariable);
            main = main.replace('params._id', theVariable);
          }

          function isStringified(jsonValue) {
            // use this function to check
            try {
              return JSON.parse(jsonValue);
            } catch (err) {
              return jsonValue;
            }
          }

          const json = isStringified(main);

          if (typeof json == 'object') {
            query[item] = JSON.parse(main);
          } else {
            main = main.replaceAll(/\"/g, '');
            query[item] = main;
          }
        });
      }

      // get query paramters
      for (const [key, value] of searchParams)
        query[key] = NormalizeString(value);
      const limit = parseInt(query.limit || defaultLimit);
      const offset = parseInt(query.offset || 0);
      delete query.offset;
      delete query.limit;

      console.log('offset:', offset);
    console.log('_id:', _id);
if(_id){
  // filter._id=_id;
  query['category']=_id;
}
    console.log('filter:', filter);
      console.log('query:', query);
      console.groupEnd();

    getTestsByCategory(
        'test',
        offset,
        limit,
        false,
        JSON.stringify(query),
        JSON.stringify(populateQuery)
      )
        .then(({ items, count }) => {
          setTracks([...items]);
          setCount(count);
        })
        .finally(() => setLoading(false));
    }
  //   ,
  //   [searchParams]
  // );

  const handleChangePage = (event, newPage) => {
    if (isClient) {
      window.scrollTo(0, 0);

      setSearchParams((p) => {
        p.set('offset', String(newPage * limit));
        return p;
      });
      loadProductItems();
    }
  };
  const handleChangeRowsPerPage = (event, obj) => {
    const newLimit = parseInt(obj.props.children);

    setSearchParams((p) => {
      p.set('limit', String(newLimit));
      p.set('offset', '0');
      return p;
    });

    loadProductItems();
  };

  return loading ? (
    <Loading />
  ) : (
    <>

        {tracks.length ? (
          tracks.map((i, idx) => (
            <Col
              key={idx}
              lg="12"
              md="12"
              sm="12"
              xs="12"
              className=" post-style-grid">
              <Headers entity={entity} />
              {entity === 'test' && <TestCard item={i} onClick={NoOp} />}

            </Col>
          ))
        ) : (
          ''
        )}

      {/*{counts > 0 && (*/}
        {/*<MyPagination*/}
          {/*rowsPerPageOptions={[5, 10, 25, 50]}*/}
          {/*component="div"*/}
          {/*count={Math.floor(counts)}*/}
          {/*rowsPerPage={limit}*/}
          {/*page={Math.floor(offset / limit)}*/}
          {/*labelRowsPerPage={t('number per row:')}*/}
          {/*nexticonbuttontext={t('next page')}*/}
          {/*previousiconbuttontext={t('previous page')}*/}
          {/*labelDisplayedRows={({ page }) =>*/}
            {/*`${page + 1} ${t('from')} ${Math.floor(counts / limit) || 1}`*/}
          {/*}*/}
          {/*onPageChange={(e, newPage) => handleChangePage(e, newPage)}*/}
          {/*// @ts-ignore*/}
          {/*onRowsPerPageChange={(e, newLimit) =>*/}
            {/*handleChangeRowsPerPage(e, newLimit)*/}
          {/*}*/}
        {/*/>*/}
      {/*)}*/}
    </>
  );
}
