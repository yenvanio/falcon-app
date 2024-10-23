export default function PrivacyPage() {
    return (
        <div className="bg-background text-foreground">
            <main className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
                <div className="space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold">Privacy Policy</h1>
                        <h3 className="text-lg font-semibold text-muted-foreground">Effective Date: 08/01/2024</h3>
                        <p className="mt-2 text-muted-foreground">This Privacy Policy describes how we collect, use, and
                            disclose personal information when you use the OAuth consent screen provided by Google to
                            log in to our application, Falcon. By logging in with your email address, you consent to the
                            practices described in this policy.</p>
                    </div>
                    <section>
                        <h2 className="text-2xl font-bold">Personal Information</h2>
                        <p className="mt-2 text-muted-foreground">
                            We collect personal information that you provide to us, such as your name, email address,
                            and
                            any other information you choose to share with us. We may also collect information about
                            your
                            usage of our website and services, including your IP address, browser type, and device
                            information.
                            We may collect and store your name, email and the permissions you grant to our application
                            during the OAuth
                            consent process. These permissions allow us to access certain information from your Google
                            account, as authorized by you.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold">Use of Information</h2>
                        <p className="mt-2 text-muted-foreground">
                            We use the personal information collected through the OAuth consent screen for the following
                            purposes:
                            <ol className="list-disc mt-2 space-y-2">
                                <li>Authentication and Account Access: We use your Google email address and associated
                                    permissions to
                                    authenticate your identity and provide you with access to our application.
                                </li>

                                <li>Service Provision: We may use the information to provide you with the requested
                                    services, including
                                    personalized features, support, and updates related to our application.
                                </li>

                                <li>Communication: We may use your email address to send you important notifications,
                                    updates, and
                                    information related to your use of our application.
                                </li>

                                <li>Improvements and Analytics: We may use aggregated and anonymized data for analytical
                                    purposes to improve
                                    our application, understand user preferences, and optimize our services.
                                </li>
                            </ol>
                        </p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold">Disclosure of Information</h2>
                        <p className="mt-2 text-muted-foreground">
                            We do not sell, trade, or otherwise transfer your personal information to third parties
                            without your explicit consent, except in the following circumstances:
                            <ol className="list-disc mt-2 space-y-2">
                                <li>Service Providers: We may share your personal information with trusted third-party
                                    service providers who assist us in operating our application and providing services
                                    to you.
                                    These service providers are contractually obligated to maintain the confidentiality
                                    and security of your personal information.
                                </li>

                                <li>Legal Compliance: We may disclose your personal information if required by law,
                                    governmental or regulatory authorities, or to protect our rights, property, or
                                    safety,
                                    or that of our users or the public.
                                </li>
                            </ol>
                        </p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold">Data Security</h2>
                        <p className="mt-2 text-muted-foreground">
                            We take reasonable measures to protect the personal information collected through the OAuth
                            consent screen
                            from unauthorized access, use, or disclosure. However, please note that no method of
                            transmission over the
                            internet or method of electronic storage is 100% secure.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold">Data Retention</h2>
                        <p className="mt-2 text-muted-foreground">
                            We retain your personal information for as long as necessary to fulfill the purposes
                            outlined in this
                            Privacy Policy, unless a longer retention period is required or permitted by law.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold">Your Rights</h2>
                        <p className="mt-2 text-muted-foreground">
                            You may have certain rights regarding your personal information, including the right to
                            access, correct, or
                            delete your information. To exercise these rights or if you have any questions or concerns
                            about the
                            processing of your personal information, please contact us using the information provided
                            below.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold">Changes to this Privacy Policy</h2>
                        <p className="mt-2 text-muted-foreground">
                            We may update this Privacy Policy from time to time to reflect changes in our practices or
                            legal
                            requirements. We will notify you of any material changes by posting the updated Privacy
                            Policy on our
                            website or through other communication channels.
                        </p>
                    </section>
                    <section>
                        <h2 className="text-2xl font-bold">Contact Us</h2>
                        <p className="mt-2 text-muted-foreground">
                            If you have any questions or concerns about this Privacy Policy or our privacy practices, please contact us
                            at team@falcon.box.

                            By using the OAuth consent screen provided by Google and logging in with your email address, you acknowledge
                            that you have read and understood this Privacy Policy and agree to the collection, use, and disclosure of
                            your personal information as described herein.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    )
}