import React from 'react';
import { useIntl, Link } from 'umi';
// import Link from 'umi/link';
import Exception from '@/components/Exception';

const intl = useIntl();

const Exception404 = () => (
  <Exception
    type="404"
    desc={intl.formatMessage({ id: 'app.exception.description.404' })}
    linkElement={Link}
    backText={intl.formatMessage({ id: 'app.exception.back' })}
  />
);

export default Exception404;
