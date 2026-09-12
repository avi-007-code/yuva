const { ZodError } = require('zod');
const { AppError } = require('./errorHandler');

const formatIssues = (issues) => issues.reduce((errors, issue) => {
  const key = issue.path.length ? issue.path.join('.') : 'request';
  if (!errors[key]) errors[key] = issue.message;
  return errors;
}, {});

// Validates only the request sections supplied by a route and replaces them
// with Zod's parsed values (for example, trimmed strings and coerced dates).
const validate = (schemas) => (req, res, next) => {
  try {
    for (const section of ['body', 'params', 'query']) {
      if (!schemas[section]) continue;
      const parsed = schemas[section].safeParse(req[section]);
      if (!parsed.success) {
        return next(new AppError('Validation failed', 400, formatIssues(parsed.error.issues)));
      }
      req[section] = parsed.data;
    }
    next();
  } catch (error) {
    next(error instanceof ZodError
      ? new AppError('Validation failed', 400, formatIssues(error.issues))
      : error);
  }
};

module.exports = { validate };
