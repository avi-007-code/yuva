// Keeps controllers focused on business data while ensuring every JSON API
// response follows the Phase 8 envelope. Existing controller-specific keys are
// collected inside `data` rather than leaked at the top level.
const responseFormatter = (req, res, next) => {
  const originalJson = res.json.bind(res);

  res.json = (payload) => {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload) || payload.__formatted) {
      return originalJson(payload);
    }

    const { success, message, errors, ...rest } = payload;
    if (success === true) {
      return originalJson({
        success: true,
        message: message || 'Request completed successfully',
        data: Object.prototype.hasOwnProperty.call(rest, 'data') && Object.keys(rest).length === 1
          ? rest.data
          : rest,
      });
    }

    if (success === false) {
      return originalJson({
        success: false,
        message: message || 'Request failed',
        errors: errors || {},
      });
    }

    return originalJson(payload);
  };

  next();
};

module.exports = { responseFormatter };
