import React, { useState, useEffect, useMemo } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import researchService from "../../../services/researchService";
import { useAuth } from "../../../contexts/AuthContext";
import { useTranslation } from "react-i18next";

const PeerReviewSection = ({ user }) => {
  const [activeTab, setActiveTab] = useState("submissions");
  const [publications, setPublications] = useState([]);
  const [userPublications, setUserPublications] = useState([]);
  const [reviewRequests, setReviewRequests] = useState([]);
  const [loading, setLoading] = useState({
    publications: true,
    userPublications: true,
    reviews: true,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const { isAuthenticated } = useAuth();
  const { t } = useTranslation("collaboration");

  const peerReviewCopy = t("peerReview", { returnObjects: true }) || {};
  const systemCopy = peerReviewCopy.system || {};
  const tabsCopy = peerReviewCopy.tabs || {};
  const filtersCopy = peerReviewCopy.filters || {};
  const statusOptionsCopy = peerReviewCopy.statusOptions || [];
  const statusLabels = peerReviewCopy.statusLabels || {};
  const publicationCardCopy = peerReviewCopy.publicationCard || {};
  const submissionsCopy = peerReviewCopy.submissions || {};
  const reviewsCopy = peerReviewCopy.reviews || {};
  const publicationsListCopy = peerReviewCopy.publicationsList || {};
  const submitModalCopy = peerReviewCopy.modals?.submit || {};
  const alertsCopy = peerReviewCopy.alerts || {};

  const defaultStatusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "draft", label: "Draft" },
    { value: "submitted", label: "Submitted" },
    { value: "under_review", label: "Under Review" },
    { value: "accepted", label: "Accepted" },
    { value: "published", label: "Published" },
  ];

  const statusOptions = statusOptionsCopy.length
    ? statusOptionsCopy
    : defaultStatusOptions;
  const statusLabelMap = useMemo(() => {
    const map = {};
    statusOptions.forEach((option) => {
      if (option?.value) {
        map[option.value] = option.label;
      }
    });
    return map;
  }, [statusOptions]);

  const formatStatus = (status) => {
    if (!status) {
      return statusLabelMap.all || "ALL";
    }
    return statusLabelMap[status] || status.replace("_", " ")?.toUpperCase();
  };

  const formatString = (template, replacements = {}) => {
    if (typeof template !== "string" || template.length === 0) {
      return "";
    }

    return Object.entries(replacements).reduce(
      (result, [key, value]) =>
        result.replace(new RegExp(`{{\\s*${key}\\s*}}`, "g"), String(value)),
      template,
    );
  };

  useEffect(() => {
    loadPublicationsData();
    if (isAuthenticated && user?.id) {
      loadUserData();
    }
  }, [user?.id]);

  const loadPublicationsData = async () => {
    try {
      const publicationsApi = researchService?.publications;
      if (!publicationsApi?.getPublished) {
        return;
      }

      const { data, error } = await publicationsApi.getPublished();
      if (!error && data) {
        setPublications(data?.slice(0, 10));
      }
    } catch (error) {
      console.error("Error loading publications:", error);
    } finally {
      setLoading((prev) => ({ ...prev, publications: false }));
    }
  };

  const loadUserData = async () => {
    if (!user?.id) return;

    try {
      const publicationsApi = researchService?.publications;
      if (!publicationsApi?.getUserPublications) {
        return;
      }

      // Load user publications
      const { data: userPubs, error: pubsError } =
        await publicationsApi.getUserPublications(user?.id);
      if (!pubsError && userPubs) {
        setUserPublications(userPubs);
      }
      setLoading((prev) => ({ ...prev, userPublications: false }));

      // Mock review requests - would load from peer_reviews table
      setReviewRequests([
        {
          id: 1,
          manuscript_title: "Impact of Microplastics on Marine Food Chain",
          authors: ["Dr. Sarah Chen", "Prof. Michael Rodriguez"],
          journal: "Marine Pollution Bulletin",
          submission_date: "2024-09-15",
          deadline: "2024-10-15",
          status: "pending",
          manuscript_type: "research_article",
          estimated_length: "8,500 words",
        },
        {
          id: 2,
          manuscript_title: "Coral Bleaching Resilience in Tropical Waters",
          authors: ["Dr. Aisha Patel", "Dr. James Wilson"],
          journal: "Coral Reefs Journal",
          submission_date: "2024-09-12",
          deadline: "2024-10-20",
          status: "in_progress",
          manuscript_type: "research_article",
          estimated_length: "12,000 words",
        },
      ]);
      setLoading((prev) => ({ ...prev, reviews: false }));
    } catch (error) {
      console.error("Error loading user data:", error);
      setLoading({
        publications: false,
        userPublications: false,
        reviews: false,
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "text-success bg-success/10";
      case "accepted":
        return "text-primary bg-primary/10";
      case "under_review":
        return "text-accent bg-accent/10";
      case "submitted":
        return "text-warning bg-warning/10";
      case "pending":
        return "text-warning bg-warning/10";
      case "in_progress":
        return "text-accent bg-accent/10";
      default:
        return "text-text-secondary bg-muted";
    }
  };

  const PublicationCard = ({ publication, showActions = false }) => {
    const title =
      publication?.title ||
      publicationCardCopy.titleFallback ||
      "Research Publication Title";
    const publicationDate = publication?.publication_date
      ? new Date(publication.publication_date).toLocaleDateString()
      : publicationCardCopy.dateFallback || "Publication Date TBD";
    const journalName =
      publication?.journal_name ||
      publicationCardCopy.journalFallback ||
      "Journal Name";
    const authorsLabel = publicationCardCopy.authorsLabel || "Authors:";
    const moreAuthorsLabel =
      publication?.publication_authors?.length > 3
        ? formatString(publicationCardCopy.moreAuthors, {
            count: publication.publication_authors.length - 3,
          })
        : null;
    const citationsText =
      formatString(publicationCardCopy.citations, {
        count: publication?.citation_count || 0,
      }) || `${publication?.citation_count || 0} citations`;
    const viewsText =
      formatString(publicationCardCopy.views, {
        count: Math.floor(Math.random() * 500) + 100,
      }) || `${Math.floor(Math.random() * 500) + 100} views`;
    const viewLabel = publicationCardCopy.view || "View";
    const editLabel = publicationCardCopy.edit || "Edit";
    const statusLabel = formatStatus(publication?.status);

    return (
      <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-cta text-lg font-semibold text-text-primary mb-2 line-clamp-2">
              {title}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-text-secondary mb-3">
              <div className="flex items-center space-x-1">
                <Icon name="Calendar" size={14} />
                <span>{publicationDate}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="BookOpen" size={14} />
                <span>{journalName}</span>
              </div>
            </div>
            <span
              className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(publication?.status)}`}
            >
              {statusLabel}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <div className="font-cta text-sm text-text-secondary mb-2">
            {authorsLabel}
          </div>
          <div className="flex flex-wrap gap-2">
            {publication?.publication_authors
              ?.slice(0, 3)
              ?.map((author, index) => (
                <span key={index} className="text-sm text-text-primary">
                  {author?.user?.full_name}
                  {index < publication?.publication_authors?.length - 1 &&
                  index < 2
                    ? ","
                    : ""}
                </span>
              ))}
            {publication?.publication_authors?.length > 3 && (
              <span className="text-sm text-text-secondary">
                {moreAuthorsLabel}
              </span>
            )}
          </div>
        </div>

        {publication?.abstract && (
          <p className="font-body text-sm text-text-secondary mb-4 line-clamp-3">
            {publication.abstract}
          </p>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-4 text-sm text-text-secondary">
            <div className="flex items-center space-x-1">
              <Icon name="Quote" size={14} />
              <span>{citationsText}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Eye" size={14} />
              <span>{viewsText}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" iconName="Eye">
              {viewLabel}
            </Button>
            {showActions && (
              <Button variant="ghost" size="sm" iconName="Edit">
                {editLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ReviewRequestCard = ({ request }) => (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-cta text-lg font-semibold text-text-primary mb-2">
            {request?.manuscript_title}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-text-secondary mb-3">
            <div className="flex items-center space-x-1">
              <Icon name="Calendar" size={14} />
              <span>
                {formatString(reviewsCopy.submitted, {
                  date: new Date(request?.submission_date).toLocaleDateString(),
                }) ||
                  `Submitted ${new Date(request?.submission_date).toLocaleDateString()}`}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={14} />
              <span>
                {formatString(reviewsCopy.due, {
                  date: new Date(request?.deadline).toLocaleDateString(),
                }) || `Due ${new Date(request?.deadline).toLocaleDateString()}`}
              </span>
            </div>
          </div>
          <span
            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request?.status)}`}
          >
            {request?.status?.replace("_", " ")?.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <div className="font-cta text-sm text-text-secondary mb-1">
            {publicationCardCopy.authorsLabel || "Authors"}
          </div>
          <div className="text-sm text-text-primary">
            {request?.authors?.join(", ")}
          </div>
        </div>
        <div>
          <div className="font-cta text-sm text-text-secondary mb-1">
            {reviewsCopy.journal || "Journal"}
          </div>
          <div className="text-sm text-text-primary">{request?.journal}</div>
        </div>
        <div>
          <div className="font-cta text-sm text-text-secondary mb-1">
            {reviewsCopy.manuscriptType || "Manuscript Type"}
          </div>
          <div className="text-sm text-text-primary">
            {request?.manuscript_type
              ?.replace("_", " ")
              ?.toLowerCase()
              ?.replace(/\b\w/g, (l) => l?.toUpperCase())}
          </div>
        </div>
        <div>
          <div className="font-cta text-sm text-text-secondary mb-1">
            {reviewsCopy.estimatedLength || "Estimated Length"}
          </div>
          <div className="text-sm text-text-primary">
            {request?.estimated_length}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="text-xs text-text-secondary">
          {formatString(reviewsCopy.reviewDeadline, {
            days: Math.ceil(
              (new Date(request?.deadline) - new Date()) /
                (1000 * 60 * 60 * 24),
            ),
          }) ||
            `Review deadline in ${Math.ceil((new Date(request?.deadline) - new Date()) / (1000 * 60 * 60 * 24))} days`}
        </div>
        <div className="flex items-center space-x-2">
          {request?.status === "pending" && (
            <>
              <Button variant="outline" size="sm" iconName="X">
                {reviewsCopy.decline || "Decline"}
              </Button>
              <Button variant="default" size="sm" iconName="Check">
                {reviewsCopy.accept || "Accept Review"}
              </Button>
            </>
          )}
          {request?.status === "in_progress" && (
            <Button variant="default" size="sm" iconName="FileText">
              {reviewsCopy.continue || "Continue Review"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const ManuscriptSubmissionModal = ({ onClose }) => {
    const [formData, setFormData] = useState({
      title: "",
      abstract: "",
      manuscript_type: "research_article",
      journal_name: "",
      keywords: "",
      co_authors: "",
    });

    const handleSubmit = async (e) => {
      e?.preventDefault();
      if (!isAuthenticated || !user?.id) return;

      try {
        const publicationsApi = researchService?.publications;
        if (!publicationsApi?.create) {
          alert(
            alertsCopy.serviceUnavailable ||
              "Publication service is unavailable right now.",
          );
          return;
        }

        const publicationData = {
          ...formData,
          status: "draft",
          keywords: formData?.keywords
            ?.split(",")
            ?.map((k) => k?.trim())
            ?.filter(Boolean),
          project_id: null, // Could be linked to a project
        };

        const { data, error } = await publicationsApi.create(publicationData);
        if (!error && data) {
          alert(
            alertsCopy.submitSuccess || "Manuscript submitted successfully!",
          );
          onClose();
          loadUserData();
        } else {
          alert(
            alertsCopy.submitError ||
              "Error submitting manuscript. Please try again.",
          );
        }
      } catch (error) {
        console.error("Error submitting manuscript:", error);
        alert(
          alertsCopy.submitError ||
            "Error submitting manuscript. Please try again.",
        );
      }
    };

    const manuscriptTypeOptions = submitModalCopy.types || [
      { value: "research_article", label: "Research Article" },
      { value: "review_article", label: "Review Article" },
      { value: "short_communication", label: "Short Communication" },
      { value: "case_study", label: "Case Study" },
      { value: "technical_note", label: "Technical Note" },
    ];
    const modalFields = submitModalCopy.fields || {};
    const modalPlaceholders = submitModalCopy.placeholders || {};
    const modalSteps = submitModalCopy.steps || [
      "Your manuscript will be saved as a draft",
      "Upload your manuscript file and supplementary materials",
      "Complete peer review matching process",
      "Submit for editorial review",
    ];

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline text-xl font-bold text-text-primary">
                {submitModalCopy.title || "Submit Manuscript"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={onClose}
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label={modalFields.title || "Manuscript Title"}
                value={formData?.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e?.target?.value }))
                }
                required
              />

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {modalFields.abstract || "Abstract"}
                </label>
                <textarea
                  value={formData?.abstract}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      abstract: e?.target?.value,
                    }))
                  }
                  rows={6}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder={
                    modalPlaceholders.abstract ||
                    "Provide a concise summary of your manuscript..."
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label={modalFields.type || "Manuscript Type"}
                  options={manuscriptTypeOptions}
                  value={formData?.manuscript_type}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, manuscript_type: value }))
                  }
                />
                <Input
                  label={modalFields.journal || "Target Journal"}
                  value={formData?.journal_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      journal_name: e?.target?.value,
                    }))
                  }
                  placeholder={
                    modalPlaceholders.journal || "e.g. Marine Biology Journal"
                  }
                  required
                />
              </div>

              <Input
                label={modalFields.keywords || "Keywords (comma-separated)"}
                value={formData?.keywords}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    keywords: e?.target?.value,
                  }))
                }
                placeholder={
                  modalPlaceholders.keywords ||
                  "marine biology, coral reefs, conservation"
                }
              />

              <Input
                label={modalFields.coAuthors || "Co-authors (comma-separated)"}
                value={formData?.co_authors}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    co_authors: e?.target?.value,
                  }))
                }
                placeholder={
                  modalPlaceholders.coAuthors ||
                  "Dr. Jane Smith, Prof. John Doe"
                }
              />

              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Icon name="Info" size={16} className="text-primary mt-0.5" />
                  <div className="text-sm text-text-secondary">
                    <div className="font-medium text-text-primary mb-1">
                      {submitModalCopy.infoHeading || "Next Steps:"}
                    </div>
                    <ol className="list-decimal list-inside space-y-1">
                      {modalSteps.map((step, index) => (
                        <li key={`${step}-${index}`}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 pt-4">
                <Button type="submit" variant="default" className="flex-1">
                  {submitModalCopy.submit || "Save as Draft"}
                </Button>
                <Button type="button" variant="outline" onClick={onClose}>
                  {submitModalCopy.cancel || "Cancel"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "submissions":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-cta text-lg font-semibold text-text-primary">
                  {submissionsCopy.heading || "Manuscript Submissions"}
                </h3>
                <p className="text-sm text-text-secondary">
                  {submissionsCopy.description ||
                    "Submit and track your research manuscripts"}
                </p>
              </div>
              {isAuthenticated && (
                <Button
                  variant="default"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={() => setShowSubmitModal(true)}
                >
                  {submissionsCopy.cta || "Submit Manuscript"}
                </Button>
              )}
            </div>

            {isAuthenticated && userPublications?.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {userPublications?.map((publication) => (
                  <PublicationCard
                    key={publication?.id}
                    publication={publication}
                    showActions={true}
                  />
                ))}
              </div>
            ) : isAuthenticated ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon
                    name="FileText"
                    size={24}
                    className="text-text-secondary"
                  />
                </div>
                <h3 className="font-cta text-lg font-semibold text-text-primary mb-2">
                  {submissionsCopy.emptyHeading || "No manuscripts yet"}
                </h3>
                <p className="font-body text-text-secondary mb-6">
                  {submissionsCopy.emptyDescription ||
                    "Submit your first research manuscript for peer review"}
                </p>
                <Button
                  variant="default"
                  iconName="Plus"
                  onClick={() => setShowSubmitModal(true)}
                >
                  {submissionsCopy.cta || "Submit Manuscript"}
                </Button>
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon
                    name="FileText"
                    size={24}
                    className="text-text-secondary"
                  />
                </div>
                <h3 className="font-cta text-lg font-semibold text-text-primary mb-2">
                  {submissionsCopy.signinHeading || "Submit Your Research"}
                </h3>
                <p className="font-body text-text-secondary mb-6">
                  {submissionsCopy.signinDescription ||
                    "Sign in to submit manuscripts and participate in peer review"}
                </p>
              </div>
            )}
          </div>
        );

      case "reviews":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-cta text-lg font-semibold text-text-primary">
                {reviewsCopy.heading || "Peer Review Requests"}
              </h3>
              <p className="text-sm text-text-secondary">
                {reviewsCopy.description ||
                  "Review manuscripts from fellow researchers"}
              </p>
            </div>

            {isAuthenticated && reviewRequests?.length > 0 ? (
              <div className="space-y-6">
                {reviewRequests?.map((request) => (
                  <ReviewRequestCard key={request?.id} request={request} />
                ))}
              </div>
            ) : isAuthenticated ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon
                    name="FileCheck"
                    size={24}
                    className="text-text-secondary"
                  />
                </div>
                <h3 className="font-cta text-lg font-semibold text-text-primary mb-2">
                  {reviewsCopy.emptyHeading || "No review requests"}
                </h3>
                <p className="font-body text-text-secondary">
                  {reviewsCopy.emptyDescription ||
                    "Review requests will appear here when you&apos;re matched with manuscripts"}
                </p>
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon
                    name="FileCheck"
                    size={24}
                    className="text-text-secondary"
                  />
                </div>
                <h3 className="font-cta text-lg font-semibold text-text-primary mb-2">
                  {reviewsCopy.signinHeading || "Become a Peer Reviewer"}
                </h3>
                <p className="font-body text-text-secondary mb-6">
                  {reviewsCopy.signinDescription ||
                    "Sign in to contribute to the scientific community through peer review"}
                </p>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-cta text-lg font-semibold text-text-primary">
                  {publicationsListCopy.heading || "Recent Publications"}
                </h3>
                <p className="text-sm text-text-secondary">
                  {publicationsListCopy.description ||
                    "Latest published research in marine sciences"}
                </p>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="search"
                  placeholder={
                    filtersCopy.searchPlaceholder || "Search publications..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                />
                <Select
                  options={statusOptions}
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  placeholder={
                    filtersCopy.statusPlaceholder || "Filter by status"
                  }
                />
              </div>
            </div>

            {loading?.publications ? (
              <div className="grid grid-cols-1 gap-6">
                {[1, 2, 3]?.map((item) => (
                  <div
                    key={item}
                    className="bg-card border border-border rounded-lg p-6 animate-pulse"
                  >
                    <div className="h-6 bg-muted rounded mb-4"></div>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded mb-4"></div>
                    <div className="h-20 bg-muted rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {publications
                  ?.filter((pub) => {
                    const matchesSearch =
                      !searchQuery ||
                      pub?.title
                        ?.toLowerCase()
                        ?.includes(searchQuery?.toLowerCase());
                    const matchesStatus =
                      selectedStatus === "all" ||
                      pub?.status === selectedStatus;
                    return matchesSearch && matchesStatus;
                  })
                  ?.map((publication) => (
                    <PublicationCard
                      key={publication?.id}
                      publication={publication}
                    />
                  ))}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-headline text-2xl font-bold text-text-primary mb-2">
          {systemCopy.heading || "Peer Review System"}
        </h2>
        <p className="font-body text-text-secondary">
          {systemCopy.description ||
            "Submit manuscripts, conduct peer reviews, and track publication progress"}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1 bg-muted/50 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("publications")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === "publications"
              ? "bg-card text-text-primary shadow-sm"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          {tabsCopy.publications || "Published Research"}
        </button>
        <button
          onClick={() => setActiveTab("submissions")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === "submissions"
              ? "bg-card text-text-primary shadow-sm"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          {tabsCopy.submissions || "My Submissions"}
          {isAuthenticated && userPublications?.length > 0 && (
            <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-primary text-white rounded-full">
              {userPublications?.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === "reviews"
              ? "bg-card text-text-primary shadow-sm"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          {tabsCopy.reviews || "Review Requests"}
          {isAuthenticated && reviewRequests?.length > 0 && (
            <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-medium bg-warning text-white rounded-full">
              {reviewRequests?.length}
            </span>
          )}
        </button>
      </div>

      {/* Content */}
      {renderTabContent()}

      {/* Submit Modal */}
      {showSubmitModal && (
        <ManuscriptSubmissionModal onClose={() => setShowSubmitModal(false)} />
      )}
    </div>
  );
};

export default PeerReviewSection;
