const { query } = require('../config/database');

exports.getAllSettings = async (req, res) => {
  const result = await query(
    'SELECT * FROM library_settings ORDER BY setting_key'
  );

  res.json({
    success: true,
    data: result.rows
  });
};

exports.getSettingByKey = async (req, res) => {
  const { key } = req.params;

  const result = await query(
    'SELECT * FROM library_settings WHERE setting_key = $1',
    [key]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Setting not found'
    });
  }

  res.json({
    success: true,
    data: result.rows[0]
  });
};

exports.updateSetting = async (req, res) => {
  const { key } = req.params;
  const { setting_value, description } = req.body;

  if (setting_value === undefined) {
    return res.status(400).json({
      success: false,
      error: 'Setting value is required'
    });
  }

  const result = await query(
    `UPDATE library_settings 
     SET setting_value = $1, description = COALESCE($2, description), updated_at = CURRENT_TIMESTAMP
     WHERE setting_key = $3
     RETURNING *`,
    [setting_value, description, key]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Setting not found'
    });
  }

  res.json({
    success: true,
    data: result.rows[0],
    message: 'Setting updated successfully'
  });
};

exports.bulkUpdateSettings = async (req, res) => {
  try {
    const { settings } = req.body;

    if (!Array.isArray(settings) || settings.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Settings array is required'
      });
    }

    const results = {
      success: 0,
      failed: 0,
      errors: []
    };

    for (const setting of settings) {
      try {
        await query(
          `UPDATE library_settings 
           SET setting_value = $1, updated_at = CURRENT_TIMESTAMP
           WHERE setting_key = $2`,
          [setting.setting_value, setting.setting_key]
        );
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          key: setting.setting_key,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      data: results,
      message: `Updated ${results.success} settings, ${results.failed} failed`
    });
  } catch (error) {
    console.error('Bulk update settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update settings'
    });
  }
};

