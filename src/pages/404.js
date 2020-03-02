import React from 'react';
import { Link, useIntl } from 'umi';

import Exception from '@/components/Exception';

export default () => (
  <Exception
    type="404"
    linkElement={Link}
    desc={useIntl.formatMessage({ id: 'app.exception.description.404' })}
    backText={useIntl.formatMessage({ id: 'app.exception.back' })}
  />
);
