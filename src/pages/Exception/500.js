import React from 'react';
import { useIntl, Link } from 'umi';
import Exception from '@/components/Exception';

const intl = useIntl();

const Exception500 = () => (
  <Exception
    type="500"
    desc={intl.formatMessage({ id: 'app.exception.description.500' })}
    linkElement={Link}
    backText={intl.formatMessage({ id: 'app.exception.back' })}
  />
);

export default Exception500;
