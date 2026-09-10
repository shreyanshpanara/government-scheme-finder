const Application = require('../models/Application');
const Scheme = require('../models/Scheme');

// @desc    Get all tracked applications for current citizen
// @route   GET /api/applications
// @access  Private
exports.getApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ user: req.user.id })
      .populate('scheme')
      .sort({ updatedAt: -1 });

    const validApps = applications.filter((app) => app.scheme);

    res.status(200).json({
      status: 'success',
      count: validApps.length,
      applications: validApps,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Start tracking a scheme application
// @route   POST /api/applications
// @access  Private
exports.createApplication = async (req, res, next) => {
  try {
    const { schemeId, referenceNumber, status, applicationDate, notes } = req.body;

    if (!schemeId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide the scheme ID to track',
      });
    }

    const scheme = await Scheme.findById(schemeId);
    if (!scheme) {
      return res.status(404).json({
        status: 'fail',
        message: 'Government scheme not found',
      });
    }

    // Check if already tracked
    const existing = await Application.findOne({
      user: req.user.id,
      scheme: schemeId,
    });

    if (existing) {
      return res.status(400).json({
        status: 'fail',
        message: 'You are already tracking an application for this scheme.',
      });
    }

    const initialStatus = status || 'Applied';
    const appRecord = await Application.create({
      user: req.user.id,
      scheme: schemeId,
      referenceNumber: referenceNumber || '',
      status: initialStatus,
      applicationDate: applicationDate || Date.now(),
      notes: notes || '',
      timeline: [
        {
          status: initialStatus,
          date: Date.now(),
          comment: 'Application tracking initiated on citizen portal.',
        },
      ],
    });

    const populated = await Application.findById(appRecord._id).populate('scheme');

    res.status(201).json({
      status: 'success',
      message: 'Application tracking started successfully',
      application: populated,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update application status / notes
// @route   PUT /api/applications/:id
// @access  Private
exports.updateApplication = async (req, res, next) => {
  try {
    const { status, referenceNumber, notes, comment } = req.body;
    let application = await Application.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!application) {
      return res.status(404).json({
        status: 'fail',
        message: 'Application record not found',
      });
    }

    if (referenceNumber !== undefined) application.referenceNumber = referenceNumber;
    if (notes !== undefined) application.notes = notes;

    if (status && status !== application.status) {
      application.status = status;
      application.timeline.push({
        status,
        date: Date.now(),
        comment: comment || `Status updated to ${status}`,
      });
    }

    await application.save();
    const updated = await Application.findById(application._id).populate('scheme');

    res.status(200).json({
      status: 'success',
      message: 'Application status updated successfully',
      application: updated,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete tracked application
// @route   DELETE /api/applications/:id
// @access  Private
exports.deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!application) {
      return res.status(404).json({
        status: 'fail',
        message: 'Application record not found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Application tracking removed',
    });
  } catch (err) {
    next(err);
  }
};
